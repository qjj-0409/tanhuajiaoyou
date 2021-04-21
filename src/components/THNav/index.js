import React, { Component } from 'react'
import {
  Text,
  View,
  ImageBackground,
  StatusBar,
  TouchableOpacity
} from 'react-native'
import { NavigationContext } from '@react-navigation/native'

import { pxToDp } from '../../utils/stylesKits'
import IconFont from '../IconFont'

class Index extends Component {
  static contextType = NavigationContext

  render() {
    return (
      <View>
        <StatusBar backgroundColor="transparent" translucent={true} />
        <ImageBackground
          source={require('../../res/headbg.png')}
          style={{
            height: pxToDp(60),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: pxToDp(25),
            paddingLeft: pxToDp(10),
            paddingRight: pxToDp(10)
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: pxToDp(80)
            }}
            onPress={() => this.context.goBack()}
          >
            <IconFont name="iconfanhui" style={{ color: '#fff' }} />
            <Text style={{ color: '#fff' }}>返回</Text>
          </TouchableOpacity>
          <Text
            style={{ color: '#fff', fontSize: pxToDp(20), fontWeight: 'bold' }}
          >
            {this.props.title}
          </Text>
          <Text
            style={{ width: pxToDp(80), color: '#fff', textAlign: 'right' }}
            onPress={this.props.onRightPress || function(){}}
          >{this.props.rightText}</Text>
        </ImageBackground>
      </View>
    )
  }
}

export default Index
