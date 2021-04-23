import React, { Component } from 'react'
import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'

import { EMOTIONS_ARR } from './datasource'
import { pxToDp, windowWidth } from '../../utils/stylesKits'

class Index extends Component {
  render() {
    // 获取屏幕的宽度 / 9
    const width = windowWidth / 10
    return (
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: pxToDp(10),
          justifyContent: 'space-between'
        }}
      >
        {
          EMOTIONS_ARR.map((v, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => this.props.onPress(v)}
              >
                <Image
                  style={{width: width, height: width}}
                  source={v.value}
                />
              </TouchableOpacity>
            )
          })
        }
      </ScrollView>
    )
  }
}

export default Index
