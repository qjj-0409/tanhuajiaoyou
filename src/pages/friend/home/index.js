import React, { Component } from 'react'
import { View, Text, StatusBar, Image } from 'react-native'
import { ImageHeaderScrollView } from 'react-native-image-header-scroll-view'
import { Overlay } from 'teaset'

import { pxToDp } from '../../../utils/stylesKits'
import FriendHead from './components/FriendHead'
import Visitors from './components/Visitors'
import PerfectGirl from './components/PerfectGirl'
import request from '../../../utils/request'
import { FRIENDS_RECOMMEND, BASE_URI } from '../../../utils/pathMap'
import IconFont from '../../../components/IconFont'
import FilterPanel from './components/FilterPanel'

// id: 7
// header: "/upload/161335014084118665711978.jpg"
// nick_name: "记号笔"
// gender: "男"
// age: 23
// marry: "已婚"
// xueli: "硕士"
// dist: 9620681.9
// agediff: 3
// fateValue: 28.5

class Index extends Component {
  state = {
    params: {
      page: 1, // 当前页数
      pagesize: 10, // 页尺寸
      gender: '男', // 性别
      distance: 2, // 距离，单位：米
      lastLogin: '', // 近期登陆时间 15分钟，1天，1小时，不限制 四个类型
      city: '', // 居住地
      education: '' // 学历
    },
    // 推荐朋友列表，数组
    recommends: []
  }

  componentDidMount() {
    this.getRecommends()
  }

  // 获取推荐朋友列表
  getRecommends = async (filterParams = {}) => {
    const res = await request.privateGet(FRIENDS_RECOMMEND, {
      ...this.state.params,
      ...filterParams
    })
    this.setState({
      recommends: res.data
    })
  }

  // 点击筛选图标，显示浮层
  recommendFilter = () => {
    // 获取需要传递的参数
    const { page, pagesize, ...others } = this.state.params
    let overlayViewRef = null
    let overlayView = (
      <Overlay.View
        modal={true}
        overlayOpacity={0.7}
        ref={v => (overlayViewRef = v)}
      >
        {/* 显示 筛选组件 */}
        <FilterPanel
          params={others}
          onClose={() => overlayViewRef.close()}
          onSubmitFilter={this.handleSubmitFilter}
        />
      </Overlay.View>
    )
    Overlay.show(overlayView)
  }

  // 接收筛选组件传递的数据
  handleSubmitFilter = filterParams => {
    // 将接收到的filterParams 和旧的params做一个对象合并
    this.getRecommends(filterParams)
  }

  render() {
    const { recommends } = this.state
    return (
      /**
       * ImageHeaderScrollView 组件属性
       *  maxHeight：最大高度
       *  minHeight：最小高度
       *  headerImage：顶部背景图片
       *  renderForeground：渲染顶部结构
       */
      <ImageHeaderScrollView
        maxHeight={pxToDp(130)}
        minHeight={pxToDp(44)}
        headerImage={require('../../../res/headfriend.png')}
        renderForeground={() => (
          // 首页顶部结构
          <View
            style={{
              height: pxToDp(130),
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* 3.控制状态栏透明 */}
            <StatusBar backgroundColor={'transparent'} translucent={true} />
            {/* 4.顶部内容组件 */}
            <FriendHead />
          </View>
        )}
      >
        {/* 首页剩余结构 */}
        <View style={{ backgroundColor: '#ccc' }}>
          {/* 1.0 访客 开始 */}
          <Visitors />
          {/* 1.0 访客 结束 */}
          {/* 2.0 今日佳人 开始 */}
          <PerfectGirl />
          {/* 2.0 今日佳人 结束 */}
          {/* 3.0 推荐朋友 开始 */}
          <View>
            {/* 3.1 标题 开始 */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: pxToDp(40),
                justifyContent: 'space-between',
                padding: pxToDp(10)
              }}
            >
              <Text style={{ color: '#787878', fontSize: pxToDp(16) }}>
                推荐
              </Text>
              <IconFont
                name="iconshaixuan"
                style={{ color: '#787878', fontSize: pxToDp(16) }}
                onPress={this.recommendFilter}
              />
            </View>
            {/* 3.1 标题 结束 */}
            {/* 3.2 列表内容 开始 */}
            <View>
              {recommends.map((v, i) => {
                return (
                  <View
                    key={i}
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
                          {v.agediff < 10 ? '年龄相仿' : '有点代购'}
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
                  </View>
                )
              })}
            </View>
            {/* 3.2 列表内容 结束 */}
          </View>
          {/* 3.0 推荐朋友 结束 */}
        </View>
      </ImageHeaderScrollView>
    )
  }
}

export default Index
