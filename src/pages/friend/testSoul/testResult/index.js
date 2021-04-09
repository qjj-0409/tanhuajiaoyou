import React, { Component } from 'react'
import { Text, View } from 'react-native'

class Index extends Component {
  render() {
    console.log(this.props.route.params)
    return (
      <View>
        <Text>测试结果</Text>
      </View>
    )
  }
}

export default Index
