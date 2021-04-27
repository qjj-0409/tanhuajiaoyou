import React, { Component } from 'react'
import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import THNav from '../../../components/THNav'
import request from '../../../utils/request'
import { BASE_URI, FRIENDS_VISITORS } from '../../../utils/pathMap'
import { pxToDp } from '../../../utils/stylesKits'
import IconFont from '../../../components/IconFont'

class Index extends Component {
  state = {
    list: [], // 访客数组
  }
  // 获取最近访客
  getList = async () => {
    const res = await request.privateGet(FRIENDS_VISITORS)
    if (res.code === '10000') {
      this.setState({ list: res.data })
    } else {
      this.setState({list: []})
    }
  }

  componentDidMount() {
    this.getList()
  }

  render() {
    const { list } = this.state
    return (
      <View>
        <THNav title="谁看过我" />
        {/* 1.0 访客头像汇总 开始 */}
        <View style={{padding: pxToDp(10), paddingTop: pxToDp(20), alignItems: 'center'}}>
          <ScrollView horizontal>
            {
              list.map((item, index) => (
                <Image
                  key={index}
                  source={{uri: BASE_URI + item.header}}
                  style={{
                    width: pxToDp(40),
                    height: pxToDp(40),
                    borderRadius: pxToDp(20)
                  }}
                />
              ))
            }
          </ScrollView>
          <Text style={{color: '#666', marginTop: pxToDp(20), fontSize: pxToDp(14)}}>最近有{list.length}人来访，快去查看...</Text>
        </View>
        {/* 1.0 访客头像汇总 结束 */}
        {/* 2.0 访客列表 开始 */}
        <View>
          {list.map((v, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => this.props.navigation.navigate('Detail', {id: v.uid})}
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#fff',
                  padding: pxToDp(15),
                  borderBottomWidth: pxToDp(1),
                  borderBottomColor: '#ccc'
                }}
              >
                {/* 图片 */}
                <View>
                  <Image
                    source={{ uri: BASE_URI + v.header }}
                    style={{
                      width: pxToDp(40),
                      height: pxToDp(40),
                      borderRadius: pxToDp(20)
                    }}
                  />
                </View>
                {/* 名称 */}
                <View
                  style={{
                    flex: 3,
                    paddingLeft: pxToDp(10),
                    justifyContent: 'space-around'
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={{
                        color: '#848484',
                        fontWeight: 'bold'
                      }}
                    >
                      {v.nick_name}
                    </Text>
                    <IconFont
                      style={{
                        color: v.gender === '女' ? '#e493ea' : '#2db3f8',
                        fontSize: pxToDp(16),
                        marginRight: pxToDp(5),
                        marginLeft: pxToDp(5)
                      }}
                      name={
                        v.gender === '女' ? 'icontanhuanv' : 'icontanhuanan'
                      }
                    />
                    <Text style={{ color: '#787878' }}>{v.age}岁</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#787878' }}>{v.marry}</Text>
                    <Text style={{ color: '#787878' }}> | </Text>
                    <Text style={{ color: '#787878' }}>{v.xueli}</Text>
                    <Text style={{ color: '#787878' }}> | </Text>
                    <Text style={{ color: '#787878' }}>
                      {v.agediff < 10 ? '年龄相仿' : '有点代沟'}
                    </Text>
                  </View>
                </View>
                {/* 缘分值 */}
                <View
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <IconFont
                    name="iconxihuan"
                    style={{ color: '#fe5012', fontSize: pxToDp(20) }}
                  />
                  <Text style={{ color: '#666' }}>{v.fateValue}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
        {/* 2.0 访客列表 结束 */}
      </View>
    )
  }
}

export default Index
