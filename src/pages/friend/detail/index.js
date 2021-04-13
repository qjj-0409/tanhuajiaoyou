import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, Modal } from 'react-native'
// 吸顶组件
import { ImageHeaderScrollView } from 'react-native-image-header-scroll-view'
// 走马灯，轮播图
import { Carousel } from 'teaset'
// 渐变
import LinearGradient from 'react-native-linear-gradient'
// 图片预览
import ImageViewer from 'react-native-image-zoom-viewer'

import request from '../../../utils/request'
import { BASE_URI, FRIENDS_PERSONALINFO } from '../../../utils/pathMap'
import { pxToDp } from '../../../utils/stylesKits'
import IconFont from '../../../components/IconFont'

class Index extends Component {
  state = {
    userDetail: {}, // 用户详情
    trends: [], // 当前用户的动态数组
    counts: 0, // 总动态条数
    totalPages: 1, // 总页数
    showAlbum: false, // 控制图片预览的显示和隐藏
    currentIndex: 0, // 当前预览图片的索引
    imgUrls: [] // 预览图片资源数组
  }
  isLoading = false // 当前是否有请求在发送
  params = {
    page: 1,
    pagesize: 5
  }
  // 获取朋友详情
  getDetail = async () => {
    const url = FRIENDS_PERSONALINFO.replace(':id', this.props.route.params.id)
    const res = await request.privateGet(url, this.params)
    this.isLoading = false
    this.setState({
      userDetail: res.data,
      trends: [...this.state.trends, ...res.data.trends],
      counts: res.counts,
      totalPages: res.pages
    })
  }

  // 预览图片
  handleShowAlbum = (i, i2) => {
    const imgUrls = this.state.trends[i].album.map(v => {
      return { url: BASE_URI + v.thum_img_path }
    })
    const currentIndex = i2
    const showAlbum = true
    this.setState({
      imgUrls,
      currentIndex,
      showAlbum
    })
  }

  // 列表滚动事件
  onScroll = ({nativeEvent}) => {
    // 1. nativeEvent.contentSize.height  列表内容的高度
    // 2. nativeEvent.layoutMeasurement.height 可视区域的高度
    // 3. nativeEvent.contentOffset.y 滚动条距离顶部的高度
    // console.log('列表内容的高度', nativeEvent.contentSize.height)
    // console.log('可视区域的高度', nativeEvent.layoutMeasurement.height)
    // console.log('滚动条距离顶部的高度', nativeEvent.contentOffset.y)
    /**
     * 滚动条触底公式：
     * 列表内容的高度 - 可视区域的高度 - 滚动条距离顶部的高度 = 0
     */
    // console.log(nativeEvent.contentSize.height - nativeEvent.layoutMeasurement.height - nativeEvent.contentOffset.y)
    const isReachBottom = nativeEvent.contentSize.height - nativeEvent.layoutMeasurement.height - nativeEvent.contentOffset.y
    // 判断是否还有下一页数据
    const hasMore = this.params.page < this.state.totalPages
    if (hasMore && !isReachBottom && !this.isLoading) {
      // 有下一页
      this.isLoading = true
      this.params.page++
      this.getDetail()
    }
  }

  // 生命周期函数-组件挂载完成后触发
  componentDidMount() {
    this.getDetail()
  }
  render() {
    const { userDetail, counts, imgUrls, currentIndex, showAlbum, trends } = this.state
    // 防止页面初始化时没有用户信息报错
    if (!userDetail.silder) return <></>
    return (
      <ImageHeaderScrollView
        maxHeight={pxToDp(220)}
        minHeight={pxToDp(40)}
        onScroll={this.onScroll}
        renderForeground={() => (
          <Carousel control style={{height: pxToDp(220)}}>
            {
              userDetail.silder.map((v, i) => {
                return (
                  <Image
                    key={i}
                    source={{uri: BASE_URI + v.thum_img_path}}
                    style={{width: '100%', height: pxToDp(220)}}
                  />
                )
              })
            }
          </Carousel>
        )}
      >
        <View style={{backgroundColor: '#fff'}}>
          {/* 1.0 用户个人信息 开始 */}
          <View style={{ flex: 1, flexDirection: 'row', padding: pxToDp(5), borderBottomWidth: pxToDp(1), borderColor: '#ccc' }}>
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
                  {userDetail.nick_name}
                </Text>
                <IconFont
                  style={{
                    color: userDetail.gender === '女' ? '#e493ea' : '#2db3f8',
                    fontSize: pxToDp(16),
                    marginRight: pxToDp(5),
                    marginLeft: pxToDp(5)
                  }}
                  name={
                    userDetail.gender === '女' ? 'icontanhuanv' : 'icontanhuanan'
                  }
                />
                <Text style={{ color: '#787878' }}>{userDetail.age}岁</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#787878' }}>{userDetail.marry}</Text>
                <Text style={{ color: '#787878' }}> | </Text>
                <Text style={{ color: '#787878' }}>{userDetail.xueli}</Text>
                <Text style={{ color: '#787878' }}> | </Text>
                <Text style={{ color: '#787878' }}>
                  {userDetail.agediff < 10 ? '年龄相仿' : '有点代沟'}
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
                  {userDetail.fateValue}
                </Text>
              </View>
              <Text style={{ color: '#fe5012', fontSize: pxToDp(13) }}>
                缘分值
              </Text>
            </View>
          </View>
          {/* 1.0 用户个人信息 结束 */}
          {/* 2.0 动态 开始 */}
          <View>
            {/* 2.1 标题 开始 */}
            <View
              style={{
                padding: pxToDp(10),
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomWidth: pxToDp(1),
                borderColor: '#ccc'
              }}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: '#666'}}>动态</Text>
                <View
                  style={{
                    backgroundColor: 'red',
                    width: pxToDp(16),
                    height: pxToDp(16),
                    borderRadius: pxToDp(8),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: pxToDp(5)
                  }}
                >
                  <Text style={{color: '#fff'}}>{counts}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={{marginRight: pxToDp(8)}}>
                  <LinearGradient
                    colors={['#eeac5e', '#ec7c50']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={{
                      width: pxToDp(100),
                      height: pxToDp(30),
                      borderRadius: pxToDp(15),
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <IconFont style={{color: '#fff', marginRight: pxToDp(5)}} name="iconliaotian" />
                    <Text style={{color: '#fff'}}>聊一下</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity>
                  <LinearGradient
                    colors={['#6d47f8', '#e36b82']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={{
                      width: pxToDp(100),
                      height: pxToDp(30),
                      borderRadius: pxToDp(15),
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <IconFont style={{color: '#fff', marginRight: pxToDp(5)}} name="iconxihuan-o" />
                    <Text style={{color: '#fff'}}>喜欢</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            {/* 2.1 标题 结束 */}
            {/* 2.2 列表 开始 */}
            <View>
              {
                trends.map((v, i) => {
                  return (
                    <View
                      key={i}
                      style={{
                        padding: pxToDp(10),
                        borderBottomColor: '#ccc',
                        borderBottomWidth: pxToDp(1)
                      }}
                    >
                      {/* 2.2.1 用户信息 开始 */}
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          style={{
                            width: pxToDp(40),
                            height: pxToDp(40),
                            borderRadius: pxToDp(20)
                          }}
                          source={{uri: BASE_URI + userDetail.header}}
                        />
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
                              marginBottom: pxToDp(10)
                            }}
                          >
                            <Text
                              style={{
                                color: '#848484',
                                fontWeight: 'bold'
                              }}
                            >
                              {userDetail.nick_name}
                            </Text>
                            <IconFont
                              style={{
                                color: userDetail.gender === '女' ? '#e493ea' : '#2db3f8',
                                fontSize: pxToDp(16),
                                marginRight: pxToDp(5),
                                marginLeft: pxToDp(5)
                              }}
                              name={
                                userDetail.gender === '女' ? 'icontanhuanv' : 'icontanhuanan'
                              }
                            />
                            <Text style={{ color: '#787878' }}>{userDetail.age}岁</Text>
                          </View>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#787878' }}>{userDetail.marry}</Text>
                            <Text style={{ color: '#787878' }}> | </Text>
                            <Text style={{ color: '#787878' }}>{userDetail.xueli}</Text>
                            <Text style={{ color: '#787878' }}> | </Text>
                            <Text style={{ color: '#787878' }}>
                              {userDetail.agediff < 10 ? '年龄相仿' : '有点代沟'}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {/* 2.2.1 用户信息 结束 */}
                      {/* 2.2.2 动态内容 开始 */}
                      <View style={{marginTop: pxToDp(5)}}>
                        <Text numberOfLines={1} style={{color: '#666'}}>{v.content}</Text>
                      </View>
                      {/* 2.2.2 动态内容 结束 */}
                      {/* 2.2.3 图片 开始 */}
                      <View
                        style={{
                          flexWrap: 'wrap',
                          flexDirection: 'row',
                          paddingTop: pxToDp(5),
                          paddingBottom: pxToDp(5)
                        }}
                      >
                        {
                          v.album.map((v2, i2) => {
                            return (
                              <TouchableOpacity key={i2} onPress={() => this.handleShowAlbum(i, i2)}>
                                <Image
                                  style={{
                                    width: pxToDp(70),
                                    height: pxToDp(70),
                                    marginRight: pxToDp(5)
                                  }}
                                  source={{uri: BASE_URI + v2.thum_img_path}}
                                />
                              </TouchableOpacity>
                            )
                          })
                        }
                      </View>
                      {/* 2.2.3 图片 结束 */}
                    </View>
                  )
                })
              }
            </View>
            {/* 2.2 列表 结束 */}
            {
              this.params.page >= this.state.totalPages ? (
                <View style={{height: pxToDp(80), justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: '#666'}}>没有更多数据了</Text>
                </View>
              ) : <></>
            }
          </View>
          {/* 2.0 动态 结束 */}
          {/* 3.0 图片预览 开始 */}
          {/* Modal 组件是一种简单的覆盖在其他视图之上显示内容的方式。
              visible 属性决定 modal 是否显示。
              transparent 属性是指背景是否透明，默认为白色，将这个属性设为：true 的时候弹出一个透明背景层的 modal。
          */}
          <Modal visible={showAlbum} transparent={true}>
            {/* imageUrls 属性是指图片资源，类型是数组
                index 属性初始化图像索引
            */}
            <ImageViewer
              imageUrls={imgUrls}
              index={currentIndex}
              onClick={() => {
                this.setState({showAlbum: false})
              }}
            />
          </Modal>
          {/* 3.0 图片预览 结束 */}
        </View>
      </ImageHeaderScrollView>
    )
  }
}

export default Index
