import React, { Component } from 'react'
import { Text, ImageBackground, TouchableOpacity } from 'react-native'
import { NavigationContext } from '@react-navigation/native'

import { pxToDp } from '../../../../utils/stylesKits'
import IconFont from '../../../../components/IconFont'

class CustormerBar extends Component {
  static contextType = NavigationContext

  // 返回到上一个页面
  geBack = () => {
    this.context.reset({
      routes: [
        { name: 'Tabbar', params: {pagename: 'my'} }
      ]
    })
  }

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
          justifyContent: 'space-evenly',
          position: 'relative'
        }}
      >
        <IconFont
          name="iconfanhui"
          style={{
            color: '#fff',
            fontSize: pxToDp(20),
            position: 'absolute',
            left: pxToDp(10),
            bottom: pxToDp(15)
          }}
          onPress={this.geBack}
        />
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
