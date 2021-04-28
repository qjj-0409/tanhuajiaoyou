import React, { Component } from 'react'
import { Text, View, TouchableOpacity, AsyncStorage } from 'react-native'
import { ListItem } from 'react-native-elements'
import { inject, observer } from 'mobx-react'
import { ActionSheet } from 'teaset'

import THNav from '../../../components/THNav'
import { pxToDp } from '../../../utils/stylesKits'
import JMessage from '../../../utils/JMessage'
import Toast from '../../../utils/Toast'

@inject('UserStore', 'RootStore')
@observer
class Index extends Component {

  // 退出登录
  handleLogOut = () => {
    /**
     * 1.询问用户是否确定退出
     * 2.清除缓存
     * 3.清除mobx中的用户数据
     * 4.清除token数据
     * 5.退出极光登录
     * 6.提示用户退出成功
     * 7.跳转回登录页面
     */
    const tmpLogout = async () => {
      console.log('执行退出')
      // 清除缓存
      await AsyncStorage.removeItem('userinfo')
      // 清除mobx中的用户数据
      this.props.UserStore.clearUser()
      // 清除token数据
      this.props.RootStore.clearUserInfo()
      // 退出极光登录
      JMessage.logout()
      // 提示用户退出成功
      Toast.smile('退出成功', 2000)
      // 跳转回登录页面
      setTimeout(() => {
        this.props.navigation.navigate('Login')
      }, 2000)
    }
    const opts = [
      {title: '退出', onPress: () => tmpLogout()}
    ]
    ActionSheet.show(opts, {title: '取消'})
  }

  render() {
    const user = this.props.UserStore.user
    return (
      <View>
        <THNav title="通用设置" />
        <View>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title style={{color: '#666'}}>设置陌生人问题</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title style={{color: '#666'}}>通知设置</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title style={{color: '#666'}}>黑名单</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
          <ListItem>
            <ListItem.Content>
              <ListItem.Title style={{color: '#666'}}>修改手机号</ListItem.Title>
            </ListItem.Content>
            <Text style={{color: '#666'}}>{user.mobile}</Text>
            <ListItem.Chevron />
          </ListItem>
        </View>
        {/* 退出登录按钮 */}
        <View style={{alignItems: 'center', marginTop: pxToDp(30)}}>
          <TouchableOpacity
            style={{
              width: '80%',
              height: pxToDp(40),
              borderRadius: pxToDp(20),
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={this.handleLogOut}
          >
            <Text style={{color: '#666', fontSize: pxToDp(16)}}>退出登录</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default Index
