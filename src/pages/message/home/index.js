import React, { Component } from 'react'
import { View, Text, StatusBar, ImageBackground, TouchableOpacity, Image } from 'react-native'
// 路由跳转
import { NavigationContext } from '@react-navigation/native'

import IconFont from '../../../components/IconFont'
import { pxToDp } from '../../../utils/stylesKits'
import JMessage from '../../../utils/JMessage'
import { BASE_URI, FRIENDS_PERSONALINFO_GUID } from '../../../utils/pathMap'
import request from '../../../utils/request'
import moment from '../../../utils/moment'

class Index extends Component {
  static contextType = NavigationContext

  // 消息菜单映射关系
  menuArr = [
    { title: '全部', iconName: 'icongonggao', bgColor: '#ebc969' },
    { title: '点赞', iconName: 'icondianzan-o', bgColor: '#ff5415' },
    { title: '评论', iconName: 'iconpinglun', bgColor: '#2fb4f9' },
    { title: '喜欢', iconName: 'iconxihuan-o', bgColor: '#1adbde' },
  ]

  state = {
    list: []
  }

  // 获取会话消息
  getConversations = async () => {
    const res = await JMessage.getConversations()
    if (res.length) {
      const idArr = res.map(v => v.target.username)
      const url = FRIENDS_PERSONALINFO_GUID.replace(':ids', idArr )
      const users = await request.privateGet(url)
      this.setState({
        list: res.map((v, i) => ({...v, user: users.data[i]}))
      })
    }
  }

  // 生命周期函数-组件挂载完毕后执行
  componentDidMount() {
    this.getConversations()
  }

  render() {
    const { list } = this.state
    return (
      <View>
        {/* 1.0 导航栏结构 开始 */}
        <StatusBar backgroundColor="transparent" translucent={true} />
        <ImageBackground
          source={require('../../../res/headbg.png')}
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
          <TouchableOpacity style={{width: pxToDp(80)}}></TouchableOpacity>
          <Text
            style={{ color: '#fff', fontSize: pxToDp(20), fontWeight: 'bold' }}
          >
            消息
          </Text>
          <IconFont
            style={{
              width: pxToDp(80),
              color: '#fff',
              textAlign: 'right',
              fontSize: pxToDp(20)
            }}
            name="icontongxunlu"
          />
        </ImageBackground>
        {/* 1.0 导航栏结构 结束 */}
        {/* 2.0 四个消息菜单 开始 */}
        <View style={{
          flexDirection: 'row',
          paddingTop: pxToDp(10),
          paddingBottom: pxToDp(10),
          paddingLeft: pxToDp(30),
          paddingRight: pxToDp(30),
          justifyContent: 'space-around',
          borderBottomWidth: pxToDp(3),
          borderBottomColor: '#ccc'
        }}>
          {
            this.menuArr.map((v, i) => {
              return (
                <TouchableOpacity key={i} style={{alignItems: 'center'}}>
                  <View
                    style={{
                      width: pxToDp(60),
                      height: pxToDp(60),
                      borderRadius: pxToDp(30),
                      backgroundColor: v.bgColor,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconFont style={{color: '#fff', fontSize: pxToDp(24)}} name={v.iconName} />
                  </View>
                  <Text style={{color: '#666', marginTop: pxToDp(5)}}>{v.title}</Text>
                </TouchableOpacity>
              )
            })
          }
        </View>
        {/* 2.0 四个消息菜单 结束 */}
        {/* 3.0 极光会话消息列表 开始 */}
        <View>
          {
            list.map((v, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  style={{
                    padding: pxToDp(10),
                    flexDirection: 'row',
                    borderBottomColor: '#ccc',
                    borderBottomWidth: pxToDp(1)
                  }}
                  onPress={() => this.context.navigate('Chat', v.user)}
                >
                  <View>
                    <Image
                      source={{uri: BASE_URI + v.user.header}}
                      style={{
                        width: pxToDp(50),
                        height: pxToDp(50),
                        borderRadius: pxToDp(25)
                      }}
                    />
                  </View>
                  <View style={{justifyContent: 'space-evenly', paddingLeft: pxToDp(10)}}>
                    <Text style={{color: '#666'}}>{v.user.nick_name}</Text>
                    <Text style={{color: '#666'}}>{v.latestMessage ? v.latestMessage.text : ''}</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text style={{color: '#666'}}>{v.latestMessage ? moment(v.latestMessage.createTime).fromNow() : ''}</Text>
                    <View style={{
                      width: pxToDp(20),
                      height: pxToDp(20),
                      borderRadius: pxToDp(10),
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'red'
                    }}>
                      <Text style={{color: '#fff'}}>{v.unreadCount}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })
          }
        </View>
        {/* 3.0 极光会话消息列表 结束 */}
      </View>
    )
  }
}

export default Index
