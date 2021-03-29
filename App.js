import React, { Component } from 'react'
import { View, AsyncStorage } from 'react-native'
import { Provider } from 'mobx-react'
import Nav from './src/nav'
import Geo from './src/utils/Geo'
import RootStore from './src/mobx'
import JMessage from './src/utils/JMessage'

class App extends Component {
  state = {
    isInitGeo: false // 是否初始化完毕
  }
  // 生命周期：组件渲染完毕执行
  async componentDidMount() {
    // 获取缓存中的用户数据
    const strUserInfo = await AsyncStorage.getItem('userinfo')
    // 防止用户第一次访问没有用户信息
    const userinfo = strUserInfo ? JSON.parse(strUserInfo) : {}
    // 判断用户信息中是否有token
    if (userinfo.token) {
      // 把缓存中的数据存一份到mobx中
      RootStore.setUserInfo(userinfo.mobile, userinfo.token, userinfo.userId)
      // 极光初始化
      JMessage.init()
    }
    // 为了提高可运行性，应用一启动就初始化
    await Geo.initGeo()
    this.setState({
      isInitGeo: true
    })
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Provider RootStore={RootStore}>
          {this.state.isInitGeo ? <Nav /> : <></>}
        </Provider>
      </View>
    )
  }
}

export default App
