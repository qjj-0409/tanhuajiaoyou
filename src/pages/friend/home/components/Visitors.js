import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import { Icon } from 'react-native-elements'

import request from '../../../../utils/request'
import { FRIENDS_VISITORS, BASE_URI } from '../../../../utils/pathMap'
import { pxToDp } from '../../../../utils/stylesKits'

class Visitors extends Component {
  state = {
    visitors: [
      // {
      //   target_uid: 63
      //   uid: 63
      //   nick_name: "M"
      //   age: 20
      //   xueli: "大专"
      //   marry: "单身"
      //   gender: "男"
      //   Distance: 0
      //   header: "/upload/161330212260415915912345.jpg"
      //   agediff: 0
      //   fateValue: 50
      // }
    ]
  }
  async componentDidMount() {
    const res = await request.privateGet(FRIENDS_VISITORS)
    this.setState({
      visitors: res.data
    })
  }
  render() {
    const { visitors } = this.state
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: pxToDp(10),
          backgroundColor: '#fff'
        }}
      >
        <Text
          style={{
            fontSize: pxToDp(14),
            color: '#777',
            marginRight: pxToDp(10)
          }}
        >
          最近有{visitors.length}人来访，快去查看...
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              flexDirection: 'row'
            }}
          >
            {visitors.map((v, i) => {
              return (
                <Image
                  key={i}
                  style={{
                    width: pxToDp(40),
                    height: pxToDp(40),
                    borderRadius: pxToDp(20)
                  }}
                  source={{ uri: BASE_URI + v.header }}
                />
              )
            })}
          </View>
          <Icon
            size={pxToDp(14)}
            name="right"
            type="ant-design"
            color="#517fa4"
          />
        </View>
      </View>
    )
  }
}

export default Visitors
