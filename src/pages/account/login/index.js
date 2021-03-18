import React, {Component} from 'react';
import {View, Text, Image, StatusBar} from 'react-native';
import {pxToDp} from '../../../utils/stylesKits';
import {Input} from 'react-native-elements';
import validator from '../../../utils/validator';
import request from '../../../utils/request';
import {ACCOUNT_LOGIN} from '../../../utils/pathMap';

class Index extends Component {
  state = {
    phoneNumber: '15915912345', // 手机号码
    phoneValid: true, // 手机号码是否正确
  };
  // 登录框手机号码输入
  phoneNumberChangeText = phoneNumber => {
    this.setState({
      phoneNumber,
    });
  };
  // 手机号提交
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
       */
      const {phoneNumber} = this.state;
      const phoneValid = validator.validatePhone(phoneNumber);
      if (!phoneValid) {
        this.setState({
          phoneValid,
        });
        return;
      }
      const res = await request.post(ACCOUNT_LOGIN, {phone: phoneNumber});
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {phoneNumber, phoneValid} = this.state;
    return (
      <View>
        {/* 0.0 状态栏 开始 */}
        <StatusBar backgroundColor="transparent" translucent={true} />
        {/* 0.0 状态栏 结束 */}
        {/* 1.0 背景图片 开始 */}
        {/* 在react-native中，200表示的单位是dp */}
        <Image
          style={{width: '100%', height: pxToDp(200)}}
          source={require('../../../res/profileBackground.jpg')}
        />
        {/* 1.0 背景图片 结束 */}

        {/* 2.0 内容 开始 */}
        <View style={{padding: pxToDp(20)}}>
          {/* 2.1 登录 开始 */}
          <View>
            {/* 标题 */}
            <View>
              <Text
                style={{
                  fontSize: pxToDp(25),
                  color: '#888',
                  fontWeight: 'bold',
                }}>
                手机号登录注册
              </Text>
            </View>
            {/* 输入框 */}
            <View style={{marginTop: pxToDp(30)}}>
              <Input
                placeholder="请输入手机号码"
                maxLength={11}
                keyboardType="phone-pad"
                value={phoneNumber}
                inputStyle={{color: '#333'}}
                onChangeText={this.phoneNumberChangeText}
                errorMessage={phoneValid ? '' : '手机号码格式不正确'}
                onSubmitEditing={this.phoneNumberSubmitEditing}
                leftIcon={{
                  type: 'font-awesome',
                  name: 'phone',
                  color: '#ccc',
                  size: pxToDp(20),
                }}
              />
            </View>
          </View>
          {/* 2.1 登录 结束 */}
        </View>
        {/* 2.0 内容 结束 */}
      </View>
    );
  }
}

export default Index;
