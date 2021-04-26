import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'

import { pxToDp } from '../../../../utils/stylesKits'
import SearchInput from '../components/SearchInput'
import { BASE_URI } from '../../../../utils/pathMap'
import IconFont from '../../../../components/IconFont'

class Index extends Component {
  state = {
    txt: ''
  }

  // 修改输入框的内容
  onChangeText = (txt) => {
    this.setState({ txt })
  }
  render() {
    const { txt } = this.state
    const { ilikelist } = this.props
    // 筛选后的数组
    // filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。 
    // 返回值：一个新的、由通过测试的元素组成的数组，如果没有任何数组元素通过测试，则返回空数组。
    // includes() 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回false。
    const list = ilikelist.filter(v => v.nick_name.includes(txt))
    return (
      <View style={{flex: 1}}>
        {/* 1.0 搜索框 */}
        <SearchInput
          style={{margin: pxToDp(10)}}
          value={this.state.txt}
          onChangeText={(txt) => this.onChangeText(txt)}
        />
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          {
            list.map((v, i) => {
              return (
                /* 2.0 用户信息 开始 */
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    padding: pxToDp(15),
                    backgroundColor: '#fff',
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
                          color: '#666',
                          fontSize: pxToDp(16),
                          fontWeight: 'bold'
                        }}
                      >
                        {v.nick_name}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          backgroundColor: '#fff',
                          marginLeft: pxToDp(5),
                          paddingLeft: pxToDp(5),
                          paddingRight: pxToDp(5)
                        }}
                      >
                        <IconFont
                          style={{
                            color: v.gender === '女' ? '#e493ea' : '#2db3f8',
                            fontSize: pxToDp(18),
                            marginRight: pxToDp(5)
                          }}
                          name={
                            v.gender === '女' ? 'icontanhuanv' : 'icontanhuanan'
                          }
                        />
                        <Text style={{ color: '#787878', fontSize: pxToDp(14) }}>{v.age}</Text>
                      </View>
                    </View>
                    {/* 定位信息 */}
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <IconFont name="iconlocation" style={{color: '#666', fontSize: pxToDp(14)}} />
                      <Text style={{color: '#666', marginLeft: pxToDp(5), fontSize: pxToDp(14)}}>{v.city}</Text>
                    </View>
                  </View>
                  {/* 按钮 */}
                  <TouchableOpacity
                    style={{
                      width: pxToDp(80),
                      height: pxToDp(30),
                      borderRadius: pxToDp(5),
                      borderColor: '#ccc',
                      borderWidth: pxToDp(1),
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      alignSelf: 'center'
                    }}>
                    <IconFont style={{color: '#666'}} name="iconjia" />
                    <Text style={{color: '#666'}}>已关注</Text>
                  </TouchableOpacity>
                </View>
                /* 2.0 用户信息 结束 */
              )
            })
          }
        </View>
      </View>
    )
  }
}

export default Index
