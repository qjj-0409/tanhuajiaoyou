import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import { ActionSheet } from 'teaset'

import THNav from '../../../../../components/THNav'
import { pxToDp } from '../../../../../utils/stylesKits'
import IconFont from '../../../../../components/IconFont'
import Geo from '../../../../../utils/Geo'
import Toast from '../../../../../utils/Toast'
import Emotion from '../../../../../components/Emotion'
import request from '../../../../../utils/request'
import { QZ_IMG_UPLOAD, QZ_DT_PUBLISH } from '../../../../../utils/pathMap'

class Index extends Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
    this.state = {
      textContent: "", // 动态内容
      longitude: "113.428247", // 经度
      latitude: "23.129183", // 纬度
      location: "天河区珠吉津安创意园(吉山西新村新街西)", // 当前地址
      // 临时图片数组
      tmpImgList: [],
      showEmotion: false // 控制表情的显示和隐藏
    }
  }

  // 设置输入框获得焦点
  handleSetInputFocus = () => {
    // isFocused()的返回值标志组件有没有获取到焦点
    if (!this.inputRef.isFocused()) {
      // 没有获得焦点， 设置获得焦点
      this.inputRef.focus()
    }
  }

  // 输入框的值改变事件
  onChangeText = textContent => {
    this.setState({
      textContent
    })
  }

  // 获取当前定位
  getCurrentPosition = async () => {
    // 定位需要使用真机联网
    const res = await Geo.getCityByLocation()
    const { province, city, district, township, streetNumber } = res.regeocode.addressComponent
    this.setState({
      location: province + city + district + township,
      longitude: streetNumber.location.split(',')[0],
      latitude: streetNumber.location.split(',')[1]
    })
  }

  // 选择图片：拍摄图片 || 选择相册中的图片
  handleSelectImg = () => {
    /**
     * title：标题
     * customButtons：自定义按钮
     * storageOptions：配置项
     */ 
    const options = {
      title: '选择图片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '相册',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      }
    }

    /**
     * 第一个参数是用于定制的选项对象(它也可以为空或忽略默认选项)，
     * 第二个参数是发送object: response的回调函数
     */
    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response)
      const { data, ...others } = response
      console.log(others)

      if (response.didCancel) { // 取消
        console.log('User cancelled image picker')
      } else if (response.error) { // 选择出错
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) { // 自定义按钮触发的回调
        console.log('User tapped custom button: ', response.customButton)
      } else { // 正常回调

        // 你也可以使用data显示图像:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        // 限制图片数量不能超过9
        const { tmpImgList } = this.state
        if (tmpImgList.length >= 9) {
          Toast.message('图片的数量不能超过9张')
          return
        }
        tmpImgList.push(response)
        this.setState({
          tmpImgList
        })
      }
    })
  }

  // 点击删除图片
  handleImageRemove = i => {
    const ImgDelete = () => {
      const { tmpImgList } = this.state
      tmpImgList.splice(i, 1)
      this.setState({ tmpImgList })
      Toast.smile('删除成功')
    }
    const options = [
      { title: '删除', onPress: ImgDelete }
    ]
    ActionSheet.show(options, {title: '取消'})
  }

  // 选择表情
  handleSelectEmotion = item => {
    this.setState({ textContent: this.state.textContent + item.key  });
  }

  // 切换显示表情组件
  toggleEmotion = () => {
    this.setState({ showEmotion: !this.state.showEmotion })
  }

  // 图片上传
  uploadImage = async () => {
    const { tmpImgList } = this.state
    if (tmpImgList.length) {
      const fd = new FormData()
      // 图片格式化
      tmpImgList.forEach(v => {
        const imgObj = {
          uri: `file://${v.path}`,
          name: v.fileName,
          type: 'application/octet-stream'
        }
        fd.append('images', imgObj)
      })
      const res = await request.privatePost(QZ_IMG_UPLOAD, fd, {
        headers: {'Content-type': 'multipart/form-data;charset=utf-8'}
      })
      return new Promise.resolve(res.data.map(v => ({headImgShortPath: v.headImgShortPath})))
    } else {
      return new Promise.resolve([])
    }
  }

  // 发动态
  submitTrend = async () => {
    /**
     * 1.获取用户的输入 文本内容、图片、当前位置，对文本进行非空校验
     * 2.将选择的图片上传到服务器，获取返回的图片地址
     * 3.将返回的图片地址和其他信息一起提交发送到后台上传动态
     * 4.返回上一页面 推荐页面
     */
    const { textContent, location, longitude, latitude, tmpImgList } = this.state
    if (!textContent || !location || !longitude || !latitude || !tmpImgList.length) {
      Toast.message('输入不合法')
      return
    }
    // 图片上传
    const imageContent = await this.uploadImage()
    const params = {textContent, location, longitude, latitude, imageContent}
    const res = await request.privatePost(QZ_DT_PUBLISH, params)
    if (res.code === '10000') {
      Toast.smile(res.data)
      /**
       * 使用 navigate 或者 goBack 实现返回上一个页面都是有bug的
       * 1.tabbar -> friend -> 圈子group -> 发动态 都会触发组件内部分生命周期 componentDidMount
       * 2.直接goBack返回上一个页面 => group - 推荐 因为 group-推荐 页面已经打开过，所以返回的时候就不会触发 componentDidMount
       * 3.这样在圈子-推荐页面就无法获取最新的动态数据
       * 
       * 解决办法：
       * this.props.navigation.reset({
       *   routes: [{name:'Tabbar', params: {pagename: 'group'}}]
       * })
       */
      setTimeout(() => {
        this.props.navigation.reset({
          routes: [
            { name: 'Tabbar', params: { pagename: 'group' } }
          ]
        })
      }, 1000);
    } else {
      Toast.sad(res.data)
    }
  }

  render() {
    const { textContent, location, tmpImgList, showEmotion } = this.state
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <THNav
          title="发动态"
          rightText="发贴"
          onRightPress={this.submitTrend}
        />
        {/* 1.0 输入框 开始 */}
        <TouchableOpacity
          style={{
            height: '40%',
            padding: pxToDp(10)
          }}
          onPress={this.handleSetInputFocus}
        >
          {/* multiline 属性表示多行输入 */}
          <TextInput
            placeholder="请填写动态（140字以内）"
            ref={ref => this.inputRef = ref}
            multiline
            value={textContent}
            style={{color: '#000'}}
            onChangeText={this.onChangeText}
          />
        </TouchableOpacity>
        {/* 1.0 输入框 结束 */}
        {/* 2.0 定位 开始 */}
        <View style={{alignItems: 'flex-end', height: pxToDp(40), justifyContent: 'center'}}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={this.getCurrentPosition}
          >
            <IconFont
              style={{
                color: '#666',
                fontSize: pxToDp(16)
              }}
              name="iconlocation"
            />
            <Text
              style={{
                color: '#aaa',
                fontSize: pxToDp(12),
                marginLeft: pxToDp(5),
                marginRight: pxToDp(10)
              }}
            >{location || '你在哪里？'}</Text>
          </TouchableOpacity>
        </View>
        {/* 2.0 定位 结束 */}
        {/* 3.0 相册 开始 */}
        <View style={{padding: pxToDp(10)}}>
          {/* ScrollView：滚动视图，必须要给一个确定的高度
              horizontal: 当此属性为 true 的时候，所有的子视图会在水平方向上排成一行，而不是默认的在垂直方向上排成一列。默认值为 false
          */}
          <ScrollView horizontal>
            {
              tmpImgList.map((v, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={{marginRight: pxToDp(5)}}
                    onPress={this.handleImageRemove.bind(this, i)}
                  >
                    <Image
                      source={{uri: v.uri}}
                      style={{width: pxToDp(50), height: pxToDp(50)}}
                    />
                  </TouchableOpacity>
                )
              })
            }
          </ScrollView>
        </View>
        {/* 3.0 相册 结束 */}
        {/* 4.0 工具栏 开始 */}
        <View
          style={{
            flexDirection: 'row',
            height: pxToDp(50),
            alignItems: 'center',
            backgroundColor: "#eee"
          }}
        >
          <TouchableOpacity
            style={{ marginLeft: pxToDp(40) }}
            onPress={this.handleSelectImg}
          >
            <IconFont style={{fontSize: pxToDp(30), color: '#666'}} name="icontupian" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: pxToDp(40) }}
            onPress={this.toggleEmotion}
          >
            <IconFont style={{fontSize: pxToDp(30), color: showEmotion ? '#9b63cd' : '#666'}} name="iconbiaoqing" />
          </TouchableOpacity>
        </View>
        {/* 4.0 工具栏 结束 */}
        {/* 5.0 表情 开始 */}
        {
          showEmotion ? <Emotion onPress={this.handleSelectEmotion} /> : <></>
        }
        {/* 5.0 表情 结束 */}
      </View>
    )
  }
}

export default Index
