import React, { Component } from 'react'
import {
  Text,
  View,
  StatusBar,
  ImageBackground,
  Image,
  TouchableOpacity
} from 'react-native'
import { Overlay } from 'teaset'

import request from '../../../utils/request'
import { FRIENDS_SEARCH, BASE_URI } from '../../../utils/pathMap'
import { pxToDp, windowWidth, windowHeight } from '../../../utils/stylesKits'
import IconFont from '../../../components/IconFont'
import FilterPanel from './components/FilterPanel'

class Index extends Component {
  params = {
    gender: '女',
    distance: 10000
  }
  state = {
    list: [
      // uid: 8
      // header: "/upload/13828459782.png"
      // nick_name: "雾霭朦胧"
      // dist: 0
    ]
  }

  // 头像宽高映射对象
  WHMap = {
    wh1: { width: pxToDp(70), height: pxToDp(100) },
    wh2: { width: pxToDp(60), height: pxToDp(86) },
    wh3: { width: pxToDp(50), height: pxToDp(72) },
    wh4: { width: pxToDp(40), height: pxToDp(57) },
    wh5: { width: pxToDp(30), height: pxToDp(43) },
    wh6: { width: pxToDp(20), height: pxToDp(29) }
  }

  // 根据 dist 返回对应宽高的档次
  getWidthHeight = dist => {
    if (dist < 200) {
      return 'wh1'
    }
    if (dist < 400) {
      return 'wh2'
    }
    if (dist < 600) {
      return 'wh3'
    }
    if (dist < 1000) {
      return 'wh4'
    }
    if (dist < 1500) {
      return 'wh5'
    }
    return 'wh6'
  }

  // 获取搜附近的数据
  getList = async () => {
    const res = await request.privateGet(FRIENDS_SEARCH, this.params)
    this.setState({
      list: res.data
    })
  }

  // 筛选事件
  handleFilterShow = () => {
    let overlayViewRef = null
    let overlayView = (
      <Overlay.View
        modal={true}
        overlayOpacity={0.7}
        ref={v => (overlayViewRef = v)}
      >
        {/* 显示 筛选组件 */}
        <FilterPanel
          params={this.params}
          onClose={() => overlayViewRef.close()}
          onSubmitFilter={this.handleSubmitFilter}
        />
      </Overlay.View>
    )
    Overlay.show(overlayView)
  }

  // 提交筛选结果
  handleSubmitFilter = fliterParams => {
    this.params = fliterParams
    this.getList()
  }

  // 生命周期函数-组件挂载后立即调用
  componentDidMount() {
    this.getList()
  }

  render() {
    const { list } = this.state
    return (
      <ImageBackground
        style={{ flex: 1, position: 'relative' }}
        source={require('../../../res/search.gif')}
      >
        <StatusBar backgroundColor="transparent" translucent={true} />
        {/* 筛选图标 开始 */}
        <TouchableOpacity
          style={{
            backgroundColor: '#fff',
            position: 'absolute',
            top: '8%',
            right: '8%',
            width: pxToDp(40),
            height: pxToDp(40),
            borderRadius: pxToDp(20),
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onPress={this.handleFilterShow}
        >
          <IconFont
            style={{ color: '#912375', fontSize: pxToDp(20) }}
            name="iconshaixuan"
          />
        </TouchableOpacity>
        {/* 筛选图标 结束 */}
        {/* 渲染附近好友 开始 */}
        {list.map((v, i) => {
          const whMap = this.WHMap[this.getWidthHeight(v.dist)]
          // 设置随机位置
          const tx = Math.random() * (windowWidth - whMap.width)
          const ty = Math.random() * (windowHeight - whMap.height)
          return (
            <TouchableOpacity
              key={i}
              style={{ position: 'absolute', left: tx, top: ty }}
            >
              <ImageBackground
                source={require('../../../res/showfirend.png')}
                resizeMode="stretch"
                style={{ ...whMap, position: 'relative', alignItems: 'center' }}
              >
                {/* numberOfLines：用来当文本过长的时候裁剪文本。包括折叠产生的换行在内，总的行数不会超过这个属性的限制。 */}
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#ffffff9a',
                    position: 'absolute',
                    top: pxToDp(-20)
                  }}
                >
                  {v.nick_name}
                </Text>
                <Image
                  source={{ uri: BASE_URI + v.header }}
                  style={{
                    width: whMap.width,
                    height: whMap.width,
                    borderRadius: whMap.width / 2
                  }}
                />
              </ImageBackground>
            </TouchableOpacity>
          )
        })}
        {/* 渲染附近好友 结束 */}
        <View
          style={{
            position: 'absolute',
            bottom: pxToDp(50),
            width: '100%',
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#fff' }}>
            您附近有
            <Text style={{ color: '#f00', fontSize: pxToDp(20) }}>
              {list.length}
            </Text>
            个好友
          </Text>
          <Text style={{ color: '#fff' }}>选择聊一聊</Text>
        </View>
      </ImageBackground>
    )
  }
}

export default Index
