import React, { Component } from 'react'
import { Text, View, FlatList, Image, TouchableOpacity, Modal } from 'react-native'
import {inject, observer} from 'mobx-react'
// 图片预览
import ImageViewer from 'react-native-image-zoom-viewer'
// 1.导入 NavigationContext 路由跳转
import { NavigationContext } from '@react-navigation/native'

import request from '../../../../utils/request'
import { QZ_ZXDT, BASE_URI, QZ_DT_DZ } from '../../../../utils/pathMap'
import IconFont from '../../../../components/IconFont'
import { pxToDp } from '../../../../utils/stylesKits'
import moment from '../../../../utils/moment'
import Toast from '../../../../utils/Toast'
import JMessage from '../../../../utils/JMessage'
import Validator from '../../../../utils/validator'
import { EMOTIONS_DATA } from '../../../../components/Emotion/datasource'


@inject('UserStore')
@observer
class Index extends Component {
  // 2.定义静态属性
  static contextType = NavigationContext

  state = {
    list: [],
    showAlbum: false, // 控制图片预览的显示和隐藏
    currentIndex: 0, // 当前预览图片的索引
    imgUrls: [] // 预览图片资源数组
  }
  totalPages = 0
  isLoading = false
  params = {
    page: 1,
    pagesize: 10
  }
  // 获取最新动态列表
  getList = async (isNew = false) => {
    const res = await request.privateGet(QZ_ZXDT, this.params)
    /*
    data: [],
    counts: 9,
    pagesize: '10',
    pages: 1,
    page: '1'
    */
    if (res.code === '10000') {
      if (isNew) {
        // 重置数据
        this.setState({ list: res.data });
      } else {
        this.setState({
          list: [...this.state.list, ...res.data]
        })
      }
      this.totalPages = res.pages
    }
    this.isLoading = false
  }

  // 滚动条触底事件
  handleEndReached = () => {
    /**
     * 1.判断还有没有下一页数据
     * 2.节流阀
     */
    if (this.params.page >= this.totalPages || this.isLoading) {
      return
    } else {
      this.isLoading = true
      this.params.page++
      this.getList()
    }
  }

  // 点赞
  handleStar = async (item) => {
    /**
     * 1.构造点赞参数，发送请求
     * 2.返回值里 提示 点赞成功还是取消点赞
     * 3.点赞成功 => 通过极光给被点赞用户发送一条消息，“xxx 点赞了你的动态”
     * 4.重新发送请求 获取 列表数据 -> 渲染
     */
    const url = QZ_DT_DZ.replace(':id', item.tid)
    const res = await request.privateGet(url)
    // 判断点赞还是取消点赞
    if (res.data.iscancelstar) {
      Toast.smile('取消点赞')
    } else {
      Toast.smile('点赞成功')
      const text = `${this.props.UserStore.user.nick_name} 点赞了你的动态`
      const extras = {user: JSON.stringify(this.props.UserStore.user), type: 'DZ'}
      JMessage.sendTextMessage(item.guid, text, extras)
      // JMessage.sendTextMessage('134120000081618303888430', text, extras)
    }
    // 重新发请求获取列表数据
    this.params.page = 1
    // 优化点赞时白屏
    this.getList(true)
  }

  // 预览图片
  handleShowAlbum = (i, i2) => {
    const imgUrls = this.state.list[i].images.map(v => {
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

  // 跳转到评论页面
  goComment = item => {
    // 3.通过上下文访问导航对象
    this.context.navigate('Comment', item)
  }

  // 渲染富文本内容
  renderRichText = (text) => {
    const list = Validator.renderRichText(text)
    const content = list.map((v, i) => {
      if (v.text) {
        return <Text key={i} style={{color: '#666'}}>{v.text}</Text>
      } else if (v.image) {
        return <Image key={i} source={EMOTIONS_DATA[v.image]} style={{width: pxToDp(20), height: pxToDp(20)}} />
      } else {
        return <></>
      }
    })
    return content
  }

  // 生命周期函数-组件挂载完毕后执行
  componentDidMount() {
    this.getList()
  }
  render() {
    const { list, imgUrls, currentIndex, showAlbum } = this.state
    return (
      <>
        <FlatList
          data={list}
          keyExtractor={v => v.tid + ''}
          onEndReachedThreshold={0.1}
          onEndReached={this.handleEndReached}
          renderItem={({item, index}) => (
            <>
              <View
                key={index}
                style={{
                  padding: pxToDp(10),
                  borderBottomColor: '#ccc',
                  borderBottomWidth: pxToDp(1)
                }}
              >
                {/* 2.2.1 用户信息 开始 */}
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
                {/* 2.2.1 用户信息 结束 */}
                {/* 2.2.2 动态内容 开始 */}
                <View style={{
                  marginTop: pxToDp(5),
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}>
                  {this.renderRichText(item.content)}
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
                    item.images.map((v2, i2) => {
                      return (
                        <TouchableOpacity key={i2} onPress={() => this.handleShowAlbum(index, i2)}>
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
                {/* 2.2.4 距离时间 开始 */}
                <View style={{flexDirection: 'row'}}>
                  <View>
                    <Text style={{color: '#666'}}>距离 {item.dist} m</Text>
                  </View>
                  <View>
                    <Text style={{color: '#666', marginLeft: pxToDp(10)}}>{moment(item.create_time).fromNow()}</Text>
                  </View>
                </View>
                {/* 2.2.4 距离时间 结束 */}
                {/* 2.2.5 3个小图标 开始 */}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: pxToDp(10)}}>
                  {/* 点赞 */}
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={this.handleStar.bind(this, item)}
                  >
                    <IconFont style={{color: '#666'}} name='icondianzan-o' />
                    <Text style={{color: '#666'}}>{item.star_count}</Text>
                  </TouchableOpacity>
                  {/* 评论 */}
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={this.goComment.bind(this, item)}
                  >
                    <IconFont style={{color: '#666'}} name='iconpinglun' />
                    <Text style={{color: '#666'}}>{item.comment_count}</Text>
                  </TouchableOpacity>
                  {/* 喜欢 */}
                  <TouchableOpacity>
                  </TouchableOpacity>
                </View>
                {/* 2.2.5 3个小图标 结束 */}
              </View>
              { (this.params.page >= this.totalPages) && (index === list.length - 1) ? (
                  <View style={{height: pxToDp(30),justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#666'}}>没有数据了</Text>
                  </View>
                ) : (<></>)
              }
            </>
          )}
        />
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
      </>
    )
  }
}

export default Index
