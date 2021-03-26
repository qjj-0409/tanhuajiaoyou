import React, { Component } from 'react'
import { View } from 'react-native'
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
    // 为了提高可运行性，应用一启动就初始化
    await Geo.initGeo()
    // 极光初始化
    JMessage.init()
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
