import React, { Component } from 'react'
import { View } from 'react-native'
import Nav from './src/nav'
import Geo from './src/utils/Geo'

class App extends Component {
  state = {
    isInitGeo: false // 是否初始化完毕
  }
  // 生命周期：组件渲染完毕执行
  async componentDidMount() {
    // 为了提高可运行性，应用一启动就初始化
    await Geo.initGeo()
    this.setState({
      isInitGeo: true
    })
  }
  render() {
    return (
      <View style={{ flex: 1 }}>{this.state.isInitGeo ? <Nav /> : <></>}</View>
    )
  }
}

export default App
