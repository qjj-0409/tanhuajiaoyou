import React, { Component } from 'react'
import { Text, View, ImageBackground, ScrollView, Image } from 'react-native'

import THNav from '../../../../components/THNav'
import { pxToDp } from '../../../../utils/stylesKits'
import { BASE_URI } from '../../../../utils/pathMap'
import THButton from '../../../../components/THButton'

class Index extends Component {
  render() {
    // 路由跳转携带的信息
    const params = this.props.route.params
    return (
      <ImageBackground
        source={require('../../../../res/qabg.png')}
        style={{flex: 1, width: '100%'}}
      >
        <THNav title="测试结果" />
        <ImageBackground
          source={require('../../../../res/result.png')}
          style={{flex: 1, width: '100%', position: 'relative'}}
          resizeMode="stretch"
        >
          {/* letterSpacing：文字之间的距离 */}
          <Text
            style={{
              position: 'absolute',
              top: '1%',
              left: '6%',
              color: '#ffffff9a',
              letterSpacing: pxToDp(10)
            }}
          >灵魂基因鉴定单</Text>
          {/* 用户名称 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              position: 'absolute',
              width: '47%',
              top: '6%',
              right: '5%'
            }}
          >
            <Text style={{color: '#fff', fontSize: pxToDp(16)}}>[</Text>
            <Text style={{color: '#fff', fontSize: pxToDp(16)}}>{params.currentUser.nick_name}</Text>
            <Text style={{color: '#fff', fontSize: pxToDp(16)}}>]</Text>
          </View>
          {/* 测试结果 */}
          <ScrollView
            style={{
              width: '47%',
              position: 'absolute',
              top: '12%',
              right: '5%',
              height: '26%'
            }}
          >
            <Text style={{color: '#fff'}}>{params.content}</Text>
          </ScrollView>
          {/* 性格分析 开始 */}
          <View style={{position: 'absolute', left: '10%', top: '44%'}}>
            <Text style={{color: '#ffffff9a'}}>外向</Text>
            <Text style={{color: '#ffffff9a'}}>{params.extroversion}%</Text>
          </View>
          <View style={{position: 'absolute', left: '10%', top: '50%'}}>
            <Text style={{color: '#ffffff9a'}}>判断</Text>
            <Text style={{color: '#ffffff9a'}}>{params.judgment}%</Text>
          </View>
          <View style={{position: 'absolute', left: '10%', top: '57%'}}>
            <Text style={{color: '#ffffff9a'}}>抽象</Text>
            <Text style={{color: '#ffffff9a'}}>{params.abstract}%</Text>
          </View>
          <View style={{position: 'absolute', right: '10%', top: '44%'}}>
            <Text style={{color: '#ffffff9a'}}>理性</Text>
            <Text style={{color: '#ffffff9a'}}>{params.rational}%</Text>
          </View>
          {/* 性格分析 结束 */}
          {/* 与你相似 开始 */}
          <Text
            style={{
              color: '#ffffff9a',
              position: 'absolute',
              top: '69%',
              left: '5%'
            }}
          >与你相似</Text>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{flexDirection: 'row', alignItems: 'center'}}
            style={{position: 'absolute', top: '74%', left: '5%'}}>
            <Image
              style={{
                width: pxToDp(40),
                height: pxToDp(40),
                borderRadius: pxToDp(20),
                marginLeft: pxToDp(5)
              }}
              source={{uri: BASE_URI + params.currentUser.header}}
            />
            <Image
              style={{
                width: pxToDp(40),
                height: pxToDp(40),
                borderRadius: pxToDp(20),
                marginLeft: pxToDp(5)
              }}
              source={{uri: BASE_URI + params.currentUser.header}}
            />
            <Image
              style={{
                width: pxToDp(40),
                height: pxToDp(40),
                borderRadius: pxToDp(20),
                marginLeft: pxToDp(5)
              }}
              source={{uri: BASE_URI + params.currentUser.header}}
            />
            <Image
              style={{
                width: pxToDp(40),
                height: pxToDp(40),
                borderRadius: pxToDp(20),
                marginLeft: pxToDp(5)
              }}
              source={{uri: BASE_URI + params.currentUser.header}}
            />
            <Image
              style={{
                width: pxToDp(40),
                height: pxToDp(40),
                borderRadius: pxToDp(20),
                marginLeft: pxToDp(5)
              }}
              source={{uri: BASE_URI + params.currentUser.header}}
            />
            <Image
              style={{
                width: pxToDp(40),
                height: pxToDp(40),
                borderRadius: pxToDp(20),
                marginLeft: pxToDp(5)
              }}
              source={{uri: BASE_URI + params.currentUser.header}}
            />
            <Image
              style={{
                width: pxToDp(40),
                height: pxToDp(40),
                borderRadius: pxToDp(20),
                marginLeft: pxToDp(5)
              }}
              source={{uri: BASE_URI + params.currentUser.header}}
            />
          </ScrollView>
          {/* 与你相似 结束 */}
          <THButton
            style={{
              width: '96%',
              height: pxToDp(40),
              position: 'absolute',
              top: '88%',
              alignSelf: 'center'
            }}
            onPress={() => this.props.navigation.navigate('TestSoul')}
          >继续测试</THButton>
        </ImageBackground>
      </ImageBackground>
    )
  }
}

export default Index
