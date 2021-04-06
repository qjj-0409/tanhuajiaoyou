import React, { Component } from 'react'
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native'
import Swiper from 'react-native-deck-swiper'

import THNav from '../../../components/THNav'
import request from '../../../utils/request'
import { FRIENDS_CARDS, BASE_URI, FRIENDS_LIKE } from '../../../utils/pathMap'
import IconFont from '../../../components/IconFont'
import { pxToDp } from '../../../utils/stylesKits'
import Toast from '../../../utils/Toast'

class Index extends Component {
  constructor(props) {
    super(props)
    this.swiperRef = React.createRef()
  }
  // 探花-左滑右滑参数
  params = {
    page: 1,
    pagesize: 5
  }
  // 自定义全局数据总页数
  totalPages = 0
  state = {
    currentIndex: 0, // 当前被操作的卡片的索引
    cards: []
    // id: 8
    // header: "/upload/13828459782.png"
    // nick_name: "雾霭朦胧"
    // age: 21
    // gender: "女"
    // marry: "未婚"
    // xueli: "大专"
    // dist: 0
  }

  // 获取要渲染的卡片数据
  getFriendCards = async () => {
    const res = await request.privateGet(FRIENDS_CARDS, this.params)
    this.totalPages = res.pages
    this.setState({
      // 新旧数据拼接
      cards: [...this.state.cards, ...res.data]
    })
  }

  // 设置喜欢或不喜欢
  setLike = async type => {
    /**
     * 1.如果通过js的方式使swiper滑动
     *  swiper的Ref 来实现，获取到swiper的ref
     *  根据swiper的ref调用 => swiperLeft()实现左滑，swiperRight()实现右滑
     * 2.根据滑动的方向或者参数来构造数据，将他们发送到后台
     *  1.需要知道当前被滑动的卡片或者索引
     *   （创建一个state数据currentIndex，当触发onSwiped事件的时候，修改currentIndex）
     */
    // this.swiperRef.swipeLeft()
    this.sentLike(type)
    if (type === 'dislike') {
      this.swiperRef.swipeLeft()
    } else {
      this.swiperRef.swipeRight()
    }
  }

  // 发送喜欢或不喜欢
  sentLike = async type => {
    const id = this.state.cards[this.state.currentIndex].id
    const url = FRIENDS_LIKE.replace(':id', id).replace(':type', type)
    const res = await request.privateGet(url)
    Toast.message(res.data, 1000, 'center')
  }

  // 当前所有图片滑动完毕触发
  handleSwipedAll = () => {
    /**
     * 1.如何判断是否有下一页数据？
     *   根据 FRIENDS_CARDS 接口返回的结果可以知道一共有几页
     *   判断 this.params.page >= this.state.totalPages 表示没有下一页
     */
    if (this.params.page >= this.totalPages) {
      Toast.message('没有下一页数据了', 1000, 'center')
      return
    } else {
      this.params.page++
      this.getFriendCards()
    }
  }

  // 生命周期函数-页面组件挂载完成
  componentDidMount() {
    this.getFriendCards()
  }

  render() {
    const { cards, currentIndex } = this.state
    // 防止图片数组为空时报错
    // if (!cards[currentIndex]) {
    //   return <></>
    // }
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <THNav title="探花" />
        <ImageBackground
          source={require('../../../res/testsoul_bg.png')}
          style={{ height: '50%' }}
          imageStyle={{ height: '100%' }}
        >
          {/* Swiper组件属性
              cards：要渲染的卡的数据数组
              renderCard：渲染卡片的函数，参数是卡片数据
              onSwiped：滑动卡片时调用的函数。它接收到滑动卡片的索引
              onSwipedAll：所有卡片都被滑动后调用的函数
              cardIndex：默认显示的卡片索引
              backgroundColor：背景颜色
              stackSize：要显示的衬垫卡数量(必须启用showSecondCard)
            */}
          {/* Swiper组件并不能根据cards的改变动态渲染组件，所以给Swiper组件绑定key={Date.now()} */}
          {cards[currentIndex] ? (
            <Swiper
              key={Date.now()}
              ref={ref => (this.swiperRef = ref)}
              cards={cards}
              renderCard={card => {
                return (
                  <View style={styles.card}>
                    <Image
                      source={{ uri: BASE_URI + card.header }}
                      style={{ width: '100%', height: '80%' }}
                    />
                    {/* 网友信息 开始 */}
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
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
                          {card.nick_name}
                        </Text>
                        <IconFont
                          style={{
                            color: card.gender === '女' ? '#e493ea' : '#2db3f8',
                            fontSize: pxToDp(16),
                            marginRight: pxToDp(5),
                            marginLeft: pxToDp(5)
                          }}
                          name={
                            card.gender === '女'
                              ? 'icontanhuanv'
                              : 'icontanhuanan'
                          }
                        />
                        <Text style={{ color: '#787878' }}>{card.age}岁</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#787878' }}>{card.marry}</Text>
                        <Text style={{ color: '#787878' }}> | </Text>
                        <Text style={{ color: '#787878' }}>{card.xueli}</Text>
                        <Text style={{ color: '#787878' }}> | </Text>
                        <Text style={{ color: '#787878' }}>
                          {card.agediff < 10 ? '年龄相仿' : '有点代沟'}
                        </Text>
                      </View>
                    </View>
                    {/* 网友信息 结束 */}
                  </View>
                )
              }}
              onSwiped={() => {
                // 修改当前滑动的索引
                this.setState({
                  currentIndex: currentIndex + 1
                })
              }}
              onSwipedAll={this.handleSwipedAll}
              onSwipedLeft={this.sentLike.bind(this, 'dislike')}
              onSwipedRight={this.sentLike.bind(this, 'like')}
              cardIndex={currentIndex}
              backgroundColor={'transparent'}
              cardVerticalMargin={0}
              stackSize={3}
            />
          ) : (
            <></>
          )}
        </ImageBackground>
        {/* 两个小图标 开始 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'center',
            width: '60%',
            marginTop: pxToDp(150)
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: '#ebc869',
              width: pxToDp(60),
              height: pxToDp(60),
              borderRadius: pxToDp(30),
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={this.setLike.bind(this, 'dislike')}
          >
            <IconFont
              name="iconbuxihuan"
              style={{
                fontSize: pxToDp(30),
                color: '#fff'
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#fe5214',
              width: pxToDp(60),
              height: pxToDp(60),
              borderRadius: pxToDp(30),
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={this.setLike.bind(this, 'like')}
          >
            <IconFont
              name="iconxihuan-o"
              style={{
                fontSize: pxToDp(30),
                color: '#fff'
              }}
            />
          </TouchableOpacity>
        </View>
        {/* 两个小图标 结尾 */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    height: '70%',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    backgroundColor: 'white'
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent'
  }
})

export default Index
