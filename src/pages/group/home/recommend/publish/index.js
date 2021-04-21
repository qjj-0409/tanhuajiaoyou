import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'
import ImagePicker from 'react-native-image-picker'

import THNav from '../../../../../components/THNav'
import { pxToDp } from '../../../../../utils/stylesKits'
import IconFont from '../../../../../components/IconFont'
import Geo from '../../../../../utils/Geo'

class Index extends Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
    this.state = {
      textContent: "", // 动态内容
      longitude: "", // 经度
      latitude: "", // 纬度
      location: "", // 当前地址
      // 图片数组
      imageContent: [
        {
          headImgShortPath: "/upload/album/18665711978/1576633170560_0.9746430185850421.jpg"
        }
      ]
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
     * customButtons：按钮
     * storageOptions：配置项
     */ 
    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
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
      console.log('Response = ', response)

      if (response.didCancel) { // 取消
        console.log('User cancelled image picker')
      } else if (response.error) { // 选择出错
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) { // 自定义按钮触发的回调
        console.log('User tapped custom button: ', response.customButton)
      } else { // 正常回调
        const source = { uri: response.uri }

        // 你也可以使用data显示图像:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        
      }
    })
  }

  render() {
    const { textContent, location } = this.state
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <THNav
          title="发动态"
          rightText="发贴"
          onRightPress={() => console.log('发帖了')}
        />
        {/* 1.0 输入框 开始 */}
        <TouchableOpacity
          style={{
            height: '40%'
          }}
          onPress={this.handleSetInputFocus}
        >
          {/* multiline 属性表示多行输入 */}
          <TextInput
            placeholder="请填写动态（140字以内）"
            ref={ref => this.inputRef = ref}
            multiline
            value={textContent}
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
                marginRight: pxToDp(5)
              }}
            >{location || '你在哪里？'}</Text>
          </TouchableOpacity>
        </View>
        {/* 2.0 定位 结束 */}


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
          >
            <IconFont style={{fontSize: pxToDp(30), color: '#666'}} name="iconbiaoqing" />
          </TouchableOpacity>
        </View>
        {/* 4.0 工具栏 结束 */}
      </View>
    )
  }
}

export default Index
