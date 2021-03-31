import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'

import request from '../../../../utils/request'
import { FRIENDS_TODAYBEST, BASE_URI } from '../../../../utils/pathMap'
import { pxToDp } from '../../../../utils/stylesKits'
import IconFont from '../../../../components/IconFont'

class PerfectGirl extends Component {
  state = {
    perfectGirl: {
      // id: 83
      // header: "/upload/18665333333.jpg"
      // nick_name: "33333"
      // gender: "女"
      // age: 20
      // marry: "单身"
      // xueli: "大专"
      // dist: 45159.4
      // agediff: 0
      // fateValue: 80
    }
  }
  async componentDidMount() {
    const res = await request.privateGet(FRIENDS_TODAYBEST)
    this.setState({
      perfectGirl: res.data[0]
    })
  }
  render() {
    const { perfectGirl } = this.state
    return (
      <View
        style={{
          flexDirection: 'row',
          margin: pxToDp(8),
          backgroundColor: '#fff'
        }}
      >
        {/* 左边图片 开始 */}
        <View style={{ position: 'relative' }}>
          <Image
            style={{ width: pxToDp(120), height: pxToDp(120) }}
            source={{ uri: BASE_URI + perfectGirl.header }}
          />
          <View
            style={{
              width: pxToDp(80),
              height: pxToDp(25),
              backgroundColor: '#b564bf',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: pxToDp(8),
              position: 'absolute',
              left: 0,
              bottom: pxToDp(10)
            }}
          >
            <Text style={{ color: '#fff', fontSize: pxToDp(14) }}>
              今日佳人
            </Text>
          </View>
        </View>
        {/* 左边图片 结束 */}
        {/* 右边内容 开始 */}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              flex: 3,
              paddingLeft: pxToDp(10),
              justifyContent: 'center'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: pxToDp(20)
              }}
            >
              <Text
                style={{
                  color: '#848484',
                  fontWeight: 'bold'
                }}
              >
                {perfectGirl.nick_name}
              </Text>
              <IconFont
                style={{
                  color: perfectGirl.gender === '女' ? '#e493ea' : '#2db3f8',
                  fontSize: pxToDp(16),
                  marginRight: pxToDp(5),
                  marginLeft: pxToDp(5)
                }}
                name={
                  perfectGirl.gender === '女' ? 'icontanhuanv' : 'icontanhuanan'
                }
              />
              <Text style={{ color: '#787878' }}>{perfectGirl.age}岁</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: '#787878' }}>{perfectGirl.marry}</Text>
              <Text style={{ color: '#787878' }}> | </Text>
              <Text style={{ color: '#787878' }}>{perfectGirl.xueli}</Text>
              <Text style={{ color: '#787878' }}> | </Text>
              <Text style={{ color: '#787878' }}>
                {perfectGirl.agediff < 10 ? '年龄相仿' : '有点代购'}
              </Text>
            </View>
          </View>
          <View
            style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
          >
            <View
              style={{
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconFont
                name="iconxihuan"
                style={{ fontSize: pxToDp(50), color: '#fe5012' }}
              />
              <Text
                style={{
                  position: 'absolute',
                  color: '#fff',
                  fontSize: pxToDp(13),
                  fontWeight: 'bold'
                }}
              >
                {perfectGirl.fateValue}
              </Text>
            </View>
            <Text style={{ color: '#fe5012', fontSize: pxToDp(13) }}>
              缘分值
            </Text>
          </View>
        </View>
        {/* 右边内容 结束 */}
      </View>
    )
  }
}

export default PerfectGirl
