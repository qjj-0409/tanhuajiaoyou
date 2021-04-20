import React, { Component } from 'react'
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native'
import { pxToDp } from '../../../../utils/stylesKits'

class CustormerBar extends Component {
  render() {
    /**
     * goToPage：负责tab栏切换
     * tabs：标题数组
     * activeTab：当前激活tab的索引
     */
    const { goToPage, tabs, activeTab } = this.props
    return (
      <ImageBackground
        source={require('../../../../res/rectanglecopy.png')}
        style={{
          height: pxToDp(60),
          flexDirection: 'row',
          justifyContent: 'space-evenly'
        }}
      >
        {
          tabs.map((v, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={{
                  justifyContent: 'center',
                  borderBottomWidth: activeTab === i ? pxToDp(3) : 0,
                  borderBottomColor: '#fff'
                }}
                onPress={() => goToPage(i)}
              >
                <Text
                  style={{
                    color: activeTab === i ? '#fff' : '#ffffff9a',
                    fontSize: activeTab === i ? pxToDp(26) : pxToDp(20)
                  }}
                >{v}</Text>
              </TouchableOpacity>
            )
          })
        }
      </ImageBackground>
    )
  }
}

export default CustormerBar
