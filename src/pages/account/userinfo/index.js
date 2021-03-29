import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import SvgUri from 'react-native-svg-uri'
import { Input } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'
import Picker from 'react-native-picker'
import ImagePicker from 'react-native-image-crop-picker'
import { Overlay } from 'teaset'
import { inject, observer } from 'mobx-react'

import { pxToDp } from '../../../utils/stylesKits'
import { male, female } from '../../../res/fonts/iconSvg'
import Geo from '../../../utils/Geo'
import CityJson from '../../../res/citys.json'
import THButton from '../../../components/THButton'
import Toast from '../../../utils/Toast'
import request from '../../../utils/request'
import { ACCOUNT_CHECKHEADIMAGE, ACCOUNT_REGINFO } from '../../../utils/pathMap'
import JMessage from '../../../utils/JMessage'

@inject('RootStore')
@observer
class Index extends Component {
  state = {
    nickname: '', // 昵称
    gender: '男', // 性别
    birthday: '', // 生日
    city: '', // 城市
    header: '', // 头像地址
    lng: '', // 经度
    lat: '', // 纬度
    address: '' // 地址
  }

  // 选择性别
  chooseGender = gender => {
    this.setState({
      gender
    })
  }

  // 昵称改变
  handleChangeNickname = nickname => {
    this.setState({
      nickname
    })
  }

  // 显示城市选择组件
  showCityPicker = () => {
    // 初始化组件
    /**
     * pickerData：要显示哪些数据，全国城市数据
     * selectedValue：默认选择的数据
     * wheelFlex：[1, 1, 0]显示省、市，不显示区
     * onPickerConfirm：确定按钮触发的事件
     */
    Picker.init({
      pickerData: CityJson,
      selectedValue: ['北京', '北京'],
      wheelFlex: [1, 1, 1], // 显示省和市
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择城市',
      onPickerConfirm: async data => {
        this.setState({
          city: data[1]
        })
        let cityDesc = data.join('')
        const res = await Geo.getCityPostion(cityDesc, data[1])
        const address = res.geocodes[0].formatted_address
        const lng = res.geocodes[0].location.split(',')[0]
        const lat = res.geocodes[0].location.split(',')[1]
        this.setState({
          address,
          lng,
          lat
        })
      }
    })
    // 显示组件
    Picker.show()
  }

  // 点击设置头像按钮
  chooseHeadImg = async () => {
    /**
     * 1.检验用户昵称、生日、当前城市 不能为空
     * 2.校验通过，使用图片裁剪插件选择图片
     * 3.将选择好的图片上传到后台
     * 4.上传成功后需要将昵称、生日、当前地址...头像的地址，一并提交到后台 --> 完成信息填写
     * 5.提交成功
     *   5.1 执行 极光注册和登录（极光：实时在线聊天）
     *   5.2 跳转到 交友-首页
     */
    const { nickname, birthday, city } = this.state
    if (!nickname || !birthday || !city) {
      Toast.sad('昵称或生日或城市不合法', 2000, 'center')
      return
    }
    // 获取选中裁剪后的图片
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    })

    let overlayViewRef = null

    // 显示审核中的效果
    let overlayView = (
      /**
       * ref={v => (this.overlayView = v)}
       * 这段代码的意义：在创建组件的时候把组件的实例挂载到this.overlayView上
       */
      <Overlay.View
        style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center' }}
        modal={true}
        overlayOpacity={0}
        ref={v => (overlayViewRef = v)}
      >
        <View
          style={{
            alignSelf: 'center',
            width: pxToDp(334),
            height: pxToDp(334),
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
              zIndex: 100
            }}
            source={require('../../../res/scan.gif')}
          />
          <Image
            style={{ width: '60%', height: '60%', marginTop: pxToDp(20) }}
            source={{ uri: image.path }}
          />
        </View>
      </Overlay.View>
    )
    Overlay.show(overlayView)

    // 调用上传头像
    let res0 = await this.uploadHeadImg(image)
    if (res0.code !== '10000') {
      // 上传失败
      return
    }
    // 上传成功，完善个人信息
    let params = this.state
    params.header = res0.data.headImgPath
    // 上传用户信息
    const res1 = await request.privatePost(ACCOUNT_REGINFO, params)
    if (res1.code !== '10000') {
      // 完善信息失败
      return
    }
    // 完善成功，注册极光
    const res2 = await this.jgBusiness(
      this.props.RootStore.userId,
      this.props.RootStore.mobile
    )

    // 极光注册完成
    // 1.关闭审核中浮层
    overlayViewRef.close()
    // 2.给出用户一个提示
    Toast.smile('恭喜 操作成功', 2000, 'center')
    // 3.跳转页面 交友页面
    setTimeout(() => {
      this.props.navigation.navigate('Tabbar')
    }, 2000)
  }

  // 上传头像
  uploadHeadImg = async image => {
    // 构造参数，上传用户信息到后台
    // 接口地址 ACCOUNT_CHECKHEADIMAGE
    let formData = new FormData()
    formData.append('headPhoto', {
      uri: image.path, // 本地图片的地址
      type: image.mime, // 图片的类型
      // 图片的名称 file://store/com/pic/dsf/d343.jpg
      name: image.path.split('/').pop()
    })

    // 执行头像上传
    return await request.privatePost(ACCOUNT_CHECKHEADIMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  // 执行极光注册
  jgBusiness = (username, password) => {
    return JMessage.register(username, password)
  }

  // 生命周期：组件渲染完毕执行
  async componentDidMount() {
    const res = await Geo.getCityByLocation()
    const address = res.regeocode.formatted_address
    const city = res.regeocode.addressComponent.province.replace('市', '')
    const lng = res.regeocode.addressComponent.streetNumber.location.split(
      ','
    )[0]
    const lat = res.regeocode.addressComponent.streetNumber.location.split(
      ','
    )[1]
    this.setState({
      address,
      city,
      lng,
      lat
    })
  }

  render() {
    const { gender, nickname, birthday, city } = this.state
    // 获取当前日期
    const dateNow = new Date()
    const currentDate = `${dateNow.getFullYear()}-${
      dateNow.getMonth() + 1
    }-${dateNow.getDate()}`
    return (
      <View style={styles.container}>
        {/* 1.0 标题 开始 */}
        <Text style={styles.titleText}>填写资料</Text>
        <Text style={styles.titleText}>提升我的魅力</Text>
        {/* 1.0 标题 结束 */}
        {/* 2.0 性别图像 开始 */}
        <View style={styles.svgContainer}>
          <View style={styles.svgParent}>
            <TouchableOpacity
              onPress={this.chooseGender.bind(this, '男')}
              style={{
                width: pxToDp(60),
                height: pxToDp(60),
                backgroundColor: gender === '男' ? 'red' : '#eee',
                borderRadius: pxToDp(30),
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <SvgUri svgXmlData={male} width="36" height="36" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.chooseGender.bind(this, '女')}
              style={{
                width: pxToDp(60),
                height: pxToDp(60),
                backgroundColor: gender === '女' ? 'red' : '#eee',
                borderRadius: pxToDp(30),
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <SvgUri svgXmlData={female} width="36" height="36" />
            </TouchableOpacity>
          </View>
        </View>
        {/* 2.0 性别图像 结束 */}
        {/* 3.0 昵称 开始 */}
        <Input
          value={nickname}
          placeholder="设置昵称"
          onChangeText={this.handleChangeNickname}
        />
        {/* 3.0 昵称 结束 */}
        {/* 4.0 生日 开始 */}
        {/*
          DatePicker组件
           androidMode：弹窗界面（spinner仅Android可用）
           style：样式
           date：绑定的日期值
           mode：日期模式，可选值date（默认）、datetime、time
           placeholder：提示框
           format：指定日期的显示格式，使用moment.js。默认值根据模式（mode）不同而不同。YYYY-MM-DD（默认）
           minDate：最小日期，一般设置为1900-01-01
           maxDate：最大日期，最好是当前日期
           confirmBtnText：确定按钮的文字
           cancelBtnText：取消按钮文字
           customStyles：自定义datepicker样式的钩子，与本机样式相同。dateTouchBody dateInput…
             dateIcon：日期图标
             dateInput：输入框样式
             placeholderText：占位符样式
             dateText：日期文本样式
           onDateChange：日期改变函数
        */}
        <DatePicker
          androidMode="spinner"
          style={{ width: '100%' }}
          date={birthday}
          mode="date"
          placeholder="设置生日"
          format="YYYY-MM-DD"
          minDate="1900-01-01"
          maxDate={currentDate}
          confirmBtnText="确定"
          cancelBtnText="取消"
          customStyles={{
            dateIcon: {
              display: 'none'
            },
            dateInput: {
              marginLeft: pxToDp(10),
              marginRight: pxToDp(10),
              borderWidth: 0,
              borderBottomWidth: pxToDp(1.1),
              borderBottomColor: '#96a1ab',
              alignItems: 'flex-start',
              paddingLeft: pxToDp(5)
            },
            placeholderText: {
              fontSize: pxToDp(19),
              color: '#939fa8'
            },
            dateText: {
              fontSize: pxToDp(18)
            }
            // ... You can check the source to find the other keys.
          }}
          onDateChange={birthday => {
            this.setState({ birthday })
          }}
        />
        {/* 4.0 生日 结束 */}
        {/* 5.0 城市选择 开始 */}
        <View style={{ marginTop: pxToDp(20) }}>
          <TouchableOpacity onPress={this.showCityPicker}>
            <Input
              value={'当前定位：' + city}
              inputStyle={{ color: '#666' }}
              disabled={true}
              rightIcon={{
                type: 'entypo',
                name: 'chevron-down',
                color: '#ccc',
                size: pxToDp(20)
              }}
            />
          </TouchableOpacity>
        </View>
        {/* 5.0 城市选择 结束 */}
        {/* 6.0 选择头像 开始 */}
        <View>
          <THButton
            style={{
              height: pxToDp(40),
              borderRadius: pxToDp(20),
              alignSelf: 'center'
            }}
            onPress={this.chooseHeadImg}
          >
            设置头像
          </THButton>
        </View>
        {/* 6.0 选择头像 结束 */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: pxToDp(20)
  },
  titleText: {
    fontSize: pxToDp(20),
    color: '#666',
    fontWeight: 'bold'
  },
  svgContainer: {
    marginTop: pxToDp(20)
  },
  svgParent: {
    width: '60%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-around'
  }
})
export default Index
