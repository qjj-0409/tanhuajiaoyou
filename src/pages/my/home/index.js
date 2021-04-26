import React, { Component } from 'react'
import { View, Text, StatusBar, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native'
// 颜色渐变
import LinearGradient from 'react-native-linear-gradient'
// 全局数据
import { inject, observer } from 'mobx-react'
// react-native UI库
import { ListItem } from 'react-native-elements'
// 路由跳转
import { NavigationContext } from '@react-navigation/native'

import { pxToDp } from '../../../utils/stylesKits'
import IconFont from '../../../components/IconFont'
import { BASE_URI, MY_COUNTS } from '../../../utils/pathMap'
import Geo from '../../../utils/Geo'
import request from '../../../utils/request'

@inject('UserStore')
@observer
class Index extends Component {
  static contextType = NavigationContext

  // 列表菜单映射关系
  list = [
    { iconName: 'icondongtai', title: '我的动态', color: '#018001', page: 'Trends' },
    { iconName: 'iconshuikanguowo', title: '谁看过我', color: '#ff0100', page: '' },
    { iconName: 'iconshezhi', title: '通用设置', color: '#883387', page: '' },
    { iconName: 'iconkefu', title: '客服在线', color: '#1e1fc2', page: '' }
  ]
  state = {
    city: '北京', // 当前定位城市
    fanCount: 0, // 粉丝的数量
    loveCount: 0, // 喜欢的数量
    eachLoveCount: 0, // 互相关注的数量
    refreshing: false // 控制刷新指示器的切换显示
  }

  // 获取当前定位城市
  getCityByLocation = async () => {
    const res = await Geo.getCityByLocation()
    this.setState({
      city: res.regeocode.addressComponent.city
    })
  }

  // 获取关注-喜欢-粉丝统计数据
  getCounts = async () => {
    const res = await request.privateGet(MY_COUNTS)
    const fanCount = res.data[0].cout
    const loveCount = res.data[1].cout
    const eachLoveCount = res.data[2].cout
    this.setState({ fanCount, loveCount, eachLoveCount })
    return Promise.resolve()
  }

  // 下拉刷新事件
  onRefresh = async () => {
    this.setState({ refreshing: true })
    await this.getCounts()
    this.setState({ refreshing: false })
  }

  componentDidMount() {
    this.getCityByLocation()
    this.getCounts()
  }

  render() {
    const user = this.props.UserStore.user
    const { city, fanCount, loveCount, eachLoveCount, refreshing } = this.state
    return (
      <ScrollView
        contentContainerStyle={{ flex: 1, backgroundColor: '#f6fcfe'}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />}
      >
        <LinearGradient
          colors={['#9b63cd', '#e06988']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{
            height: pxToDp(150),
            position: 'relative'
          }}
        >
          <StatusBar backgroundColor="transparent" translucent />
          {/* 1.0 编辑图标 */}
          <IconFont
            name="iconbianji"
            style={{
              position: 'absolute',
              top: pxToDp(30),
              right: pxToDp(20),
              color: '#fff',
              fontSize: pxToDp(20)
            }}
          />
          {/* 2.0 用户信息 开始 */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              padding: pxToDp(15),
              marginTop: pxToDp(40)
            }}
          >
            {/* 图片 */}
            <View>
              <Image
                source={{ uri: BASE_URI + user.header }}
                style={{
                  width: pxToDp(60),
                  height: pxToDp(60),
                  borderRadius: pxToDp(30)
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
                    color: '#fff',
                    fontSize: pxToDp(16),
                    fontWeight: 'bold'
                  }}
                >
                  {user.nick_name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    borderRadius: pxToDp(8),
                    marginLeft: pxToDp(5),
                    paddingLeft: pxToDp(5),
                    paddingRight: pxToDp(5)
                  }}
                >
                  <IconFont
                    style={{
                      color: user.gender === '女' ? '#e493ea' : '#2db3f8',
                      fontSize: pxToDp(18),
                      marginRight: pxToDp(5)
                    }}
                    name={
                      user.gender === '女' ? 'icontanhuanv' : 'icontanhuanan'
                    }
                  />
                  <Text style={{ color: '#787878', fontSize: pxToDp(14) }}>{user.age}</Text>
                </View>
              </View>
              {/* 定位信息 */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconFont name="iconlocation" style={{color: '#fff', fontSize: pxToDp(14)}} />
                <Text style={{color: '#fff', marginLeft: pxToDp(5), fontSize: pxToDp(14)}}>{city}</Text>
              </View>
            </View>
          </TouchableOpacity>
          {/* 2.0 用户信息 结束 */}
        </LinearGradient>
        {/* 3.0 互相关注-喜欢-粉丝 开始 */}
        <View
          style={{
            backgroundColor: '#fff',
            width: '90%',
            height: pxToDp(100),
            alignSelf: 'center',
            marginTop: pxToDp(-10),
            borderRadius: pxToDp(10),
            flexDirection: 'row'
          }}
        >
          <TouchableOpacity
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => this.context.navigate('Follow', 0)}
          >
            <Text style={{color: '#666', fontSize: pxToDp(20)}}>{eachLoveCount}</Text>
            <Text style={{color: '#919191', fontSize: pxToDp(14), marginTop: pxToDp(5)}}>互相关注</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => this.context.navigate('Follow', 1)}
          >
            <Text style={{color: '#666', fontSize: pxToDp(20)}}>{loveCount}</Text>
            <Text style={{color: '#919191', fontSize: pxToDp(14), marginTop: pxToDp(5)}}>喜欢</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => this.context.navigate('Follow', 2)}
          >
            <Text style={{color: '#666', fontSize: pxToDp(20)}}>{fanCount}</Text>
            <Text style={{color: '#919191', fontSize: pxToDp(14), marginTop: pxToDp(5)}}>粉丝</Text>
          </TouchableOpacity>
        </View>
        {/* 3.0 互相关注-喜欢-粉丝 结束 */}
        {/* 4.0 列表菜单 开始 */}
        <View style={{marginTop: pxToDp(10)}}>
          {
            this.list.map((v, i) => {
              return (
                /* ListItem 组件
                    bottomDivider 属性，在列表项底部添加分割物（即下边框）
                  ListItem.Content 相当与View组件，用来存放列表项的内容
                  ListItem.Title 相当于Text组件，用来存放列表项的标题
                  ListItem.Chevron 相当与Icon组件，用来存放字体图标，默认是 > （为展开的手风琴）
                */
                <ListItem key={i} bottomDivider onPress={() => this.context.navigate(v.page)}>
                  <IconFont name={v.iconName} style={{color: v.color, fontSize: pxToDp(20)}} />
                  <ListItem.Content>
                    <ListItem.Title style={{color: '#868686', fontSize: pxToDp(16)}}>{v.title}</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              )
            })
          }
        </View>
        {/* 4.0 列表菜单 结束 */}
      </ScrollView>
    )
  }
}

export default Index
