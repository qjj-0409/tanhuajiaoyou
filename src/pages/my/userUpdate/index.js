import React, { Component } from 'react'
import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import { inject, observer } from 'mobx-react'
import { ListItem, Overlay } from 'react-native-elements'
// 裁剪图片
import ImagePicker from 'react-native-image-crop-picker'
// 日期选择框
import DatePicker from 'react-native-datepicker'
// 选择器
import Picker from 'react-native-picker'

import THNav from '../../../components/THNav'
import THButton from '../../../components/THButton'
import { pxToDp } from '../../../utils/stylesKits'
import { BASE_URI, ACCOUNT_CHECKHEADIMAGE, MY_SUBMITUSERINFO, MY_INFO } from '../../../utils/pathMap'
import moment from '../../../utils/moment'
import request from '../../../utils/request'
import Toast from '../../../utils/Toast'
import CityJson from '../../../res/citys.json'

@inject('UserStore')
@observer
class Index extends Component {
  // {
  //   "header": "/upload/13828459782.png",
  //   "nickname": "雾霭朦胧",
  //   "birthday": "1997-12-19",
  //   "age": "21",
  //   "gender": "女",
  //   "city": "广州市",
  //   "address": "广州市天河区珠吉路58号",
  //   "xueli": "本科",
  //   "marry": "单身"
  // }
  constructor(props) {
    super(props)
    const {header, nick_name, birthday, gender, city, xueli, marry } = this.props.UserStore.user
    this.state = {
      user: {
        header: header || '',
        nickname: nick_name || '',
        birthday: moment(birthday).format('YYYY-MM-DD') || "",
        gender: gender || "",
        city: city || "",
        xueli: xueli || "",
        marry: marry || ""
      },
      isShowNickName: false, // 是否显示昵称输入框
      submitLoading: false // 控制确认按钮是否可以点击
    }
  }

  // 选择头像
  chooseHeadImg = async () => {
    // 获取选中裁剪后的图片
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    })

    // 调用上传头像
    let res0 = await this.uploadHeadImg(image)
    if (res0.code !== '10000') {
      // 上传失败
      return
    }
    
    // 上传成功，完善个人信息
    const newheader = res0.data.headImgShortPath
    const {header, ...others} = this.state.user
    this.setState({
      user: {header: newheader, ...others}
    })
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

  // 编辑昵称
  nickNameUpdate = async ({nativeEvent}) => {
    /**
     * 1.获取输入框中的文本
     *   两种方式：
     *   1.1 在state中声明一个txt变量，绑定给TextInput组件的value属性和onChangeText事件
     *   1.2 非受控表单的方式，软键盘的 确定/提交 被点击时，传递的参数 {nativeEvent: {text, eventCount, target}}
     */
    const newnickname = nativeEvent.text
    if (!newnickname.trim()) {
      Toast.message('请输入合法的昵称')
      return
    }
    const {nickname, ...others} = this.state.user
    this.setState({
      user: {nickname: newnickname, ...others},
      isShowNickName: false
    })
  }

  // 编辑生日
  birthdayUpdate = async (newbirthday) => {
    const {birthday, ...others} = this.state.user
    this.setState({
      user: {birthday: newbirthday, ...others}
    })
  }

  // 选择性别
  chooseGender = () => {
    Picker.init({
      pickerData: ['男', '女'], // 可选数据项
      selectedValue: [this.props.UserStore.user.gender], // 选中的值
      wheelFlex: [1, 0, 0], // 显示省 市 区
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择性别',
      onPickerConfirm: this.genderUpdate
    })
    Picker.show()
  }

  // 编辑性别
  genderUpdate = async arr => {
    const {gender, ...others} = this.state.user
    this.setState({
      user: {gender: arr[0], ...others}
    })
  }

  // 选择城市
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
      onPickerConfirm: this.cityUpdate
    })
    // 显示组件
    Picker.show()
  }

  // 编辑城市
  cityUpdate = async (arr) => {
    const {city, ...others} = this.state.user
    this.setState({
      user: {city: arr[1], ...others}
    })
  }

  // 选择学历
  chooseEducation = () => {
    Picker.init({
      pickerData: ['博士后', '博士', '硕士', '本科', '大专', '高中', '留学', '其他'], // 可选数据项
      selectedValue: [this.props.UserStore.user.xueli], // 选中的值
      wheelFlex: [1, 0, 0], // 显示省 市 区
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择学历',
      onPickerConfirm: this.xueliUpdate
    })
    Picker.show()
  }

  // 编辑学历
  xueliUpdate = async arr => {
    const {xueli, ...others} = this.state.user
    this.setState({
      user: {xueli: arr[0], ...others}
    })
  }

  // 选择婚姻状态
  showMarryPicker = () => {
    Picker.init({
      pickerData: ['单身', '未婚', '已婚'], // 可选数据项
      selectedValue: [this.props.UserStore.user.marry], // 选中的值
      wheelFlex: [1, 0, 0], // 显示省 市 区
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择婚姻状态',
      onPickerConfirm: this.marryUpdate
    })
    Picker.show()
  }

  // 编辑婚姻状态
  marryUpdate = async (arr) => {
    const {marry, ...others} = this.state.user
    this.setState({
      user: {marry: arr[0], ...others}
    })
  }

  // 完成编辑
  onSubmitUser = async () => {
    if (this.state.submitLoading) return
    this.setState({ submitLoading: true })
    const res = await request.privatePost(MY_SUBMITUSERINFO, this.state.user)
    this.setState({ submitLoading: false })
    // 1.给用户一个友好的提示
    if (res.code === '10000') {
      Toast.smile('修改成功')
      // 2.刷新数据
      const res2 = await request.privateGet(MY_INFO)
      this.props.UserStore.setUser(res2.data)
    } else {
      Toast.sad('修改失败，请稍后重试')
    }
  }

  render() {
    const {user, isShowNickName, submitLoading} = this.state
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <THNav title="编辑资料" />
        {/* 用户信息 开始 */}
        {/* 
          ListItem 组件
            bottomDivider 属性，在列表项底部添加分割物（即下边框）
          ListItem.Content 相当与View组件，用来存放列表项的内容
          ListItem.Title 相当于Text组件，用来存放列表项的标题
          ListItem.Chevron 相当与Icon组件，用来存放字体图标，默认是 > （为展开的手风琴）
        */}
        {/* 头像 */}
        <ListItem bottomDivider onPress={this.chooseHeadImg}>
          <ListItem.Content>
            <ListItem.Title style={{color: '#868686', fontSize: pxToDp(16)}}>头像</ListItem.Title>
          </ListItem.Content>
          <Image
            style={{width: pxToDp(40), height: pxToDp(40), borderRadius: pxToDp(20)}}
            source={{uri: BASE_URI + user.header}}
          />
          <ListItem.Chevron />
        </ListItem>
        {/* 昵称 */}
        <ListItem bottomDivider onPress={() => this.setState({ isShowNickName: true})}>
          <ListItem.Content>
            <ListItem.Title style={{color: '#868686', fontSize: pxToDp(16)}}>昵称</ListItem.Title>
          </ListItem.Content>
          <Text style={{color: '#666', fontSize: pxToDp(14)}}>{user.nickname}</Text>
          <ListItem.Chevron />
        </ListItem>
        {/* 生日 */}
        <View style={{position: 'relative'}}>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title style={{color: '#868686', fontSize: pxToDp(16)}}>生日</ListItem.Title>
            </ListItem.Content>
            <Text style={{color: '#666', fontSize: pxToDp(14)}}>{moment(user.birthday).format('YYYY-MM-DD')}</Text>
            <ListItem.Chevron />
          </ListItem>
          {/* 生日 弹出框 开始 */}
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
            style={{ width: '100%', position: 'absolute', top: 0, left: 0, height: '100%', opacity: 0 }}
            date={moment(user.birthday).format('YYYY-MM-DD')}
            mode="date"
            placeholder="设置生日"
            format="YYYY-MM-DD"
            minDate="1900-01-01"
            maxDate={moment(new Date()).format('YYYY-MM-DD')}
            confirmBtnText="确定"
            cancelBtnText="取消"
            onDateChange={this.birthdayUpdate}
          />
          {/* 生日 弹出框 结束 */}
        </View>
        {/* 选择性别 */}
        <ListItem bottomDivider onPress={this.chooseGender}>
          <ListItem.Content>
            <ListItem.Title style={{color: '#868686', fontSize: pxToDp(16)}}>选择性别</ListItem.Title>
          </ListItem.Content>
          <Text style={{color: '#666', fontSize: pxToDp(14)}}>{user.gender}</Text>
          <ListItem.Chevron />
        </ListItem>
        {/* 现居城市 */}
        <ListItem bottomDivider onPress={this.showCityPicker}>
          <ListItem.Content>
            <ListItem.Title style={{color: '#868686', fontSize: pxToDp(16)}}>现居城市</ListItem.Title>
          </ListItem.Content>
          <Text style={{color: '#666', fontSize: pxToDp(14)}}>{user.city}</Text>
          <ListItem.Chevron />
        </ListItem>
        {/* 学历 */}
        <ListItem bottomDivider onPress={this.chooseEducation}>
          <ListItem.Content>
            <ListItem.Title style={{color: '#868686', fontSize: pxToDp(16)}}>学历</ListItem.Title>
          </ListItem.Content>
          <Text style={{color: '#666', fontSize: pxToDp(14)}}>{user.xueli}</Text>
          <ListItem.Chevron />
        </ListItem>
        {/* 月收入 */}
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title style={{color: '#868686', fontSize: pxToDp(16)}}>月收入</ListItem.Title>
          </ListItem.Content>
          <Text style={{color: '#666', fontSize: pxToDp(14)}}>15K-25K</Text>
          <ListItem.Chevron />
        </ListItem>
        {/* 行业 */}
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title style={{color: '#868686', fontSize: pxToDp(16)}}>行业</ListItem.Title>
          </ListItem.Content>
          <Text style={{color: '#666', fontSize: pxToDp(14)}}>产品经理</Text>
          <ListItem.Chevron />
        </ListItem>
        {/* 婚姻状态 */}
        <ListItem bottomDivider onPress={this.showMarryPicker}>
          <ListItem.Content>
            <ListItem.Title style={{color: '#868686', fontSize: pxToDp(16)}}>婚姻状态</ListItem.Title>
          </ListItem.Content>
          <Text style={{color: '#666', fontSize: pxToDp(14)}}>{user.marry}</Text>
          <ListItem.Chevron />
        </ListItem>
        {/* 用户信息 结束 */}
        {/* 昵称 弹出框 */}
        {/* 
          Overlay 弹出层组件
            isVisible 属性 控制弹出层的显示和隐藏
            onBackdropPress 事件 点击灰色背景时触发
        */}
        <Overlay isVisible={isShowNickName} onBackdropPress={() => this.setState({isShowNickName : false})}>
          <TextInput
            placeholder="修改昵称"
            style={{width: pxToDp(200)}}
            onSubmitEditing={this.nickNameUpdate}
          />
        </Overlay>
        <View style={{alignItems: 'center', marginTop: pxToDp(40)}}>
          <THButton
            style={{width: '80%', height: pxToDp(40)}}
            onPress={this.onSubmitUser}
            disabled={submitLoading}
          >确认</THButton>
        </View>
      </View>
    )
  }
}

export default Index
