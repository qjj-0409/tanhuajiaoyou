import React, { Component } from 'react'
import { View, Text, Image, StatusBar, StyleSheet } from 'react-native'
import { Input } from 'react-native-elements'
import { CodeField, Cursor } from 'react-native-confirmation-code-field'

import { pxToDp } from '../../../utils/stylesKits'
import validator from '../../../utils/validator'
import request from '../../../utils/request'
import { ACCOUNT_LOGIN, ACCOUNT_VALIDATEVCODE } from '../../../utils/pathMap'
import THButton from '../../../components/THButton'
import Toast from '../../../utils/Toast'

class Index extends Component {
  state = {
    phoneNumber: '15915912345', // 手机号码
    phoneValid: true, // 手机号码是否正确
    showLogin: true, // 是否显示登录页面
    vcodeTxt: '', // 输入的验证码
    btnText: '重新获取', // 倒计时按钮的文本
    isCountDowning: false // 是否在倒计时中
  }
  // 登录框手机号码输入
  phoneNumberChangeText = phoneNumber => {
    this.setState({
      phoneNumber
    })
  }
  // 手机号提交 | 点击获取验证码事件
  phoneNumberSubmitEditing = async () => {
    try {
      /**
       * 1.校验手机号码的合法性--正则
       *   不通过，提示
       * 2.通过，将手机号码发送到后台对应接口 ---> 获取验证码
       *  优化：
       *   1.发送异步请求的时候，自动的显示等待框
       *   2.请求完成，等待框隐藏
       *   3.关键技术
       *     1.等待框 teaset
       *     2.自动 ---> axios拦截器
       * 3.将登陆页面切换成填写验证码的界面
       * 4.开启定时器
       */
      const { phoneNumber } = this.state
      const phoneValid = validator.validatePhone(phoneNumber)
      if (!phoneValid) {
        this.setState({
          phoneValid
        })
        return
      }
      const res = await request.post(ACCOUNT_LOGIN, { phone: phoneNumber })
      console.log(res)
      if (res.code === '10000') {
        // 请求成功
        this.setState({
          showLogin: false
        })
        // 开启定时器
        this.countDown()
      } else {
        // 请求失败
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 开启获取验证码的定时器
  countDown = () => {
    if (this.state.isCountDowning) {
      return
    }
    this.setState({
      isCountDowning: true
    })
    let seconds = 5
    this.setState({
      btnText: `重新获取(${seconds}s)`
    })
    let timeId = setInterval(() => {
      seconds--
      this.setState({
        btnText: `重新获取(${seconds}s)`
      })
      if (seconds === 0) {
        clearInterval(timeId)
        this.setState({
          btnText: '重新获取',
          isCountDowning: false
        })
      }
    }, 1000)
  }

  // 点击重新获取验证码按钮
  repGetVcode = () => {
    this.countDown()
  }

  // 验证码输入完毕事件
  onVcodeSubmitEditing = async () => {
    try {
      /**
       * 1.对验证码进行校验
       *   前端：对验证码长度进行校验
       *   后台：将手机号和验证码一起发送给后台
       *   后台返回值字段：isNew ---> 用来标识新老用户
       * 2.根据新老用户跳转到指定页面
       *   新用户 ---> 完善个人信息页面
       *   老用户 ---> 交友 - 首页
       */
      const { phoneNumber, vcodeTxt } = this.state
      if (vcodeTxt.length !== 6) {
        Toast.message('验证码不正确', 2000, 'center')
        return
      }
      const res = await request.post(ACCOUNT_VALIDATEVCODE, {
        phone: phoneNumber,
        vcode: vcodeTxt
      })
      if (res.code !== '10000') {
        console.log(res)
        return
      }
      console.log(this.props)
      if (res.data.isNew) {
        // 新用户 userinfo
        this.props.navigation.navigate('UserInfo')
      } else {
        // 老用户
        alert('老用户 跳转到交友页面')
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 渲染登录页面
  renderLogin = () => {
    const { phoneNumber, phoneValid, showLogin } = this.state
    return (
      <View>
        {/* 标题 */}
        <View>
          <Text
            style={{
              fontSize: pxToDp(25),
              color: '#888',
              fontWeight: 'bold'
            }}
          >
            手机号登录注册
          </Text>
        </View>
        {/* 输入框 */}
        <View style={{ marginTop: pxToDp(30) }}>
          <Input
            placeholder="请输入手机号码"
            maxLength={11}
            keyboardType="phone-pad"
            value={phoneNumber}
            inputStyle={{ color: '#333' }}
            onChangeText={this.phoneNumberChangeText}
            errorMessage={phoneValid ? '' : '手机号码格式不正确'}
            onSubmitEditing={this.phoneNumberSubmitEditing}
            leftIcon={{
              type: 'font-awesome',
              name: 'phone',
              color: '#ccc',
              size: pxToDp(20)
            }}
          />
        </View>
        {/* 渐变按钮 */}
        <View>
          {/* align-self 属性用于设置弹性元素自身在侧轴（这里是横轴）方向上的对齐方式。 */}
          <View
            style={{ width: '100%', height: pxToDp(40), alignSelf: 'center' }}
          >
            <THButton
              style={{ borderRadius: pxToDp(20) }}
              onPress={this.phoneNumberSubmitEditing}
            >
              获取验证码
            </THButton>
          </View>
        </View>
      </View>
    )
  }

  // 渲染填写验证码页面
  renderVCode = () => {
    const { phoneNumber, vcodeTxt, btnText, isCountDowning } = this.state
    return (
      <View>
        <View>
          <Text
            style={{
              fontSize: pxToDp(24),
              color: '#4b4b4b',
              fontWeight: 'bold'
            }}
          >
            输入6位验证码
          </Text>
        </View>
        <View style={{ marginTop: pxToDp(15) }}>
          <Text style={{ color: '#666666' }}>已发到：+86 {phoneNumber}</Text>
        </View>
        {/* 验证码 */}
        <View>
          {/* CodeField组件
            ref：操作元素
            {...props}：解构接收到的属性
            value：输入的值
            onChangeText：输入框值改变触发的事件
            cellCount：单元格的个数
            rootStyle：样式
            keyboardType：键盘类型，number-pad 数字键盘
            renderCell：单元格渲染所需的函数
            renderCell: (options: {symbol: string, index: number, isFocused: boolean}) => ReactElement */}
          <CodeField
            value={vcodeTxt}
            onChangeText={this.onVcodeChangeText}
            cellCount={6}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            onSubmitEditing={this.onVcodeSubmitEditing}
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </View>
        <View style={{ marginTop: pxToDp(15) }}>
          <THButton
            disabled={isCountDowning}
            style={{
              width: '100%',
              height: pxToDp(40),
              alignSelf: 'center',
              borderRadius: pxToDp(20)
            }}
            onPress={this.repGetVcode}
          >
            {btnText}
          </THButton>
        </View>
      </View>
    )
  }

  // 验证码输入框值改变时触发的函数
  onVcodeChangeText = vcodeTxt => {
    this.setState({
      vcodeTxt
    })
  }

  render() {
    const { phoneNumber, phoneValid, showLogin } = this.state
    return (
      <View>
        {/* 0.0 状态栏 开始 */}
        <StatusBar backgroundColor="transparent" translucent={true} />
        {/* 0.0 状态栏 结束 */}
        {/* 1.0 背景图片 开始 */}
        {/* 在react-native中，200表示的单位是dp */}
        <Image
          style={{ width: '100%', height: pxToDp(220) }}
          source={require('../../../res/profileBackground.jpg')}
        />
        {/* 1.0 背景图片 结束 */}

        {/* 2.0 内容 开始 */}
        <View style={{ padding: pxToDp(20) }}>
          {/* 2.1 登录 开始 */}
          {showLogin ? this.renderLogin() : this.renderVCode()}
          {/* 2.1 登录 结束 */}
        </View>
        {/* 2.0 内容 结束 */}
      </View>
    )
  }
}

// 验证码样式
const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    // 修改单元格的边框，borderWidth所有的边框，borderBottomWidth下边框
    borderBottomWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
    color: '#9b63cd'
  },
  focusCell: {
    borderColor: '#9b63cd'
  }
})

export default Index
