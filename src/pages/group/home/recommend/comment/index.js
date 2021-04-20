import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native'

import THNav from '../../../../../components/THNav'
import IconFont from '../../../../../components/IconFont'
import moment from '../../../../../utils/moment'
import { pxToDp } from '../../../../../utils/stylesKits'
import { BASE_URI, QZ_DT_PL, QZ_DT_PL_DZ, QZ_DT_PL_TJ } from '../../../../../utils/pathMap'
import THButton from '../../../../../components/THButton'
import request from '../../../../../utils/request'
import Toast from '../../../../../utils/Toast'

class Index extends Component {
  params = {
    page: 1,
    pagesize: 10
  }
  totalPages = 0 // 总页数
  isLoading = false // 节流阀
  state = {
    list: [], // 评论列表
    counts: 0, // 评论数量
    showInput: true, // 控制输入框的显示和隐藏
    text: '', // 输入框绑定的值
  }

  // 获取评论列表
  getList = async (isNew = false) => {
    // const url = QZ_DT_PL.replace(':id', 1)
    const url = QZ_DT_PL.replace(':id', this.props.route.params.tid)
    const res = await request.privateGet(url, this.params)
    if (isNew) {
      this.setState({
        list: res.data,
        counts: res.counts
      })
    } else {
      this.setState({
        list: [...this.state.list, ...res.data],
        counts: res.counts
      })
    }
    this.totalPages = res.pages
    this.isLoading = false
  }

  // 评论-点赞
  handleSetStar = async id => {
    const url = QZ_DT_PL_DZ.replace(':id', id)
    const res = await request.privateGet(url)
    Toast.smile('点赞成功')
    this.params.page = 1
    this.getList(true)
  }

  // 结束输入
  handleEditingEnd = () => {
    this.setState({
      showInput: false,
      text: ''
    })
  }

  // 发布评论
  handleSubmit = async () => {
    /**
     * 1.获取评论内容 非空判断
     * 2.开始构造参数，发送请求 完成评论
     * 3.手动把输入框隐藏
     * 4.重新渲染评论列表
     */
    const { text } = this.state
    if (!text.trim()) {
      Toast.message('评论内容不能为空')
      return
    }
    const url = QZ_DT_PL_TJ.replace(':id', this.props.route.params.tid)
    const res = await request.privatePost(url, {comment: text})
    this.handleEditingEnd()
    this.params.page = 1
    this.getList(true)
    Toast.smile('评论成功')
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
    const hasMore = this.params.page < this.totalPages
    if (hasMore && !isReachBottom && !this.isLoading) {
      // 有下一页
      this.isLoading = true
      this.params.page++
      this.getList()
    }
  }

  // 生命周期函数-组件挂载完毕之后执行
  componentDidMount() {
    this.getList()
  }

  render() {
    const item = this.props.route.params
    const { list, counts, showInput, text } = this.state
    return (
      <ScrollView
        style={{flex: 1, backgroundColor: '#fff'}}
        onScroll={this.onScroll}
      >
        <THNav title="最新评论" />
        {/* 1.0 用户信息 开始 */}
        <View style={{padding: pxToDp(10)}}>
          {/* 1.1 用户信息 开始 */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{
                width: pxToDp(40),
                height: pxToDp(40),
                borderRadius: pxToDp(20)
              }}
              source={{uri: BASE_URI + item.header}}
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
                  {item.nick_name}
                </Text>
                <IconFont
                  style={{
                    color: item.gender === '女' ? '#e493ea' : '#2db3f8',
                    fontSize: pxToDp(16),
                    marginRight: pxToDp(5),
                    marginLeft: pxToDp(5)
                  }}
                  name={
                    item.gender === '女' ? 'icontanhuanv' : 'icontanhuanan'
                  }
                />
                <Text style={{ color: '#787878' }}>{item.age}岁</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#787878' }}>{item.marry}</Text>
                <Text style={{ color: '#787878' }}> | </Text>
                <Text style={{ color: '#787878' }}>{item.xueli}</Text>
                <Text style={{ color: '#787878' }}> | </Text>
                <Text style={{ color: '#787878' }}>
                  {item.agediff < 10 ? '年龄相仿' : '有点代沟'}
                </Text>
              </View>
            </View>
          </View>
          {/* 1.1 用户信息 结束 */}
          {/* 1.2 动态内容 开始 */}
          <View style={{marginTop: pxToDp(5)}}>
            <Text style={{color: '#666'}}>{item.content}</Text>
          </View>
          {/* 1.2 动态内容 结束 */}
          {/* 1.3 图片 开始 */}
          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
              paddingTop: pxToDp(5),
              paddingBottom: pxToDp(5)
            }}
          >
            {
              item.images.map((v2, i2) => {
                return (
                  <TouchableOpacity key={i2}>
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
          {/* 1.3 图片 结束 */}
          {/* 1.4 距离时间 开始 */}
          <View style={{flexDirection: 'row'}}>
            <View>
              <Text style={{color: '#666'}}>距离 {item.dist} m</Text>
            </View>
            <View>
              <Text style={{color: '#666', marginLeft: pxToDp(10)}}>{moment(item.create_time).fromNow()}</Text>
            </View>
          </View>
          {/* 1.4 距离时间 结束 */}
          {/* 1.5 最新评论 开始 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: pxToDp(10)
            }}
          >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#666'}}>最新评论</Text>
              <View
                style={{
                  backgroundColor: 'red',
                  width: pxToDp(20),
                  height: pxToDp(20),
                  borderRadius: pxToDp(10),
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: pxToDp(5)
                }}
              >
                <Text style={{color: '#fff'}}>{counts}</Text>
              </View>
            </View>
            <View>
              <THButton
                style={{width: pxToDp(80), height: pxToDp(20), borderRadius: pxToDp(10)}}
                textStyle={{fontSize: pxToDp(10)}}
                onPress={() => this.setState({ showInput: true })}
              >发表评论</THButton>
            </View>
          </View>
          {/* 1.5 最新评论 结束 */}
          {/* 1.6 评论列表 开始 */}
          <View>
            {
              list.map((v, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      flexDirection: 'row',
                      paddingTop: pxToDp(5),
                      paddingBottom: pxToDp(5),
                      borderBottomColor: '#ccc',
                      borderBottomWidth: pxToDp(1),
                      alignItems: 'center'
                    }}
                  >
                    <View style={{paddingRight: pxToDp(10)}}>
                      <Image
                        source={{uri: BASE_URI + v.header}}
                        style={{
                          width: pxToDp(40),
                          height: pxToDp(40),
                          borderRadius: pxToDp(20)
                        }}
                      />
                    </View>
                    <View>
                      <Text style={{color: '#666'}}>{v.nick_name}</Text>
                      <Text
                        style={{color: '#666', fontSize: pxToDp(10), marginTop: pxToDp(5), marginBottom: pxToDp(5)}}
                      >{moment(v.create_time).format('YYYY-MM-DD HH:mm:ss')}</Text>
                      <Text>{v.content}</Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        flexDirection:'row',
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                      }}
                      onPress={this.handleSetStar.bind(this, v.cid)}
                    >
                      <IconFont name='icondianzan-o' style={{color: '#666', fontSize: pxToDp(14)}} />
                      <Text style={{color: '#666'}}>{v.star}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })
            }
          </View>
          {/* 1.6 评论列表 结束 */}
          {/* 1.7 评论输入框 开始 */}
          {/*
            Modal 组件是一种简单的覆盖在其他视图之上显示内容的方式。
              visible 属性决定 modal 是否显示。
              transparent 属性是指背景是否透明，默认为白色，将这个属性设为：true 的时候弹出一个透明背景层的 modal。
              animationType 指定了 modal 的动画类型。
                slide 从底部滑入滑出。
              onRequestClose 回调会在用户按下 Android 设备上的后退按键或是 Apple TV 上的菜单键时触发。请务必注意本属性在 Android 平台上为必需，且会在 modal 处于开启状态时阻止BackHandler事件。
           */}
          <Modal
            visible={showInput}
            transparent={true}
            animationType='slide'
            onRequestClose={this.handleEditingEnd}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                position: 'relative'
              }}
              onPress={this.handleEditingEnd}
            >
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  left: 0,
                  bottom: 0,
                  backgroundColor: '#eee',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: pxToDp(5)
                }}
              >
                <TextInput
                  style={{
                    backgroundColor: '#fff',
                    flex: 5,
                    height: pxToDp(36),
                    borderRadius: pxToDp(18),
                    marginRight: pxToDp(10),
                    paddingLeft: pxToDp(10)
                  }}
                  placeholder="发表评论"
                  autoFocus
                  value={text}
                  onChangeText={t => this.setState({ text: t })}
                  onSubmitEditing={this.handleSubmit}
                />
                <Text
                  style={{flex: 1, textAlign: 'center', color: '#666'}}
                  onPress={this.handleSubmit}
                >发布</Text>
              </View>
            </TouchableOpacity>
          </Modal>
          {/* 1.7 评论输入框 结束 */}
        </View>
        {/* 1.0 用户信息 结束 */}
        {
          this.params.page >= this.totalPages ? (
            <View style={{height: pxToDp(40), justifyContent: 'center', backgroundColor: '#ccc'}}>
              <Text style={{textAlign: 'center'}}>没有更多评论了</Text>
            </View>
          ) : (<></>)
        }
      </ScrollView>
    )
  }
}

export default Index
