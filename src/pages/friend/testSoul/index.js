import React, { Component } from 'react'
import { Text, View, ImageBackground, StyleSheet, Image } from 'react-native'
import Swiper from 'react-native-deck-swiper'

import THNav from '../../../components/THNav'
import request from '../../../utils/request'
import { BASE_URI, FRIENDS_QUESTIONS } from '../../../utils/pathMap'
import { pxToDp } from '../../../utils/stylesKits'
import THButton from '../../../components/THButton'

class Index extends Component {
  state = {
    questions: [
      // qid: 1
      // type: "初级"
      // title: "初级灵魂题"
      // star: 2
      // imgpath: "/upload/questions/1.png"
      // status: 0
      // count: 3
      // sort_no: 1
      // istested: true
      // islock: false
    ],
    currentIndex: 0 // 当前问卷索引
  }

  // 获取测试等级问卷列表数据
  getList = async () => {
    const res = await request.privateGet(FRIENDS_QUESTIONS)
    this.setState({
      questions: res.data
    })
  }

  // 跳转到答题页面
  goAskPage = () => {
    // 1.获取当前的测试题等级的相关数据
    const { questions, currentIndex } = this.state
    // 2.跳转到答题页面并且带上数据
    this.props.navigation.navigate('TestQA', questions[currentIndex])
  }

  // 生命周期函数-组件挂载完毕后执行
  componentDidMount() {
    this.getList()
  }
  render() {
    const { questions, currentIndex } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <THNav title="测灵魂" />
        <ImageBackground
          source={require('../../../res/testsoul_bg.png')}
          style={{ width: '100%', height: '50%' }}
          imageStyle={{ height: '100%' }}
        >
          {questions.length ? (
            <Swiper
              cards={questions}
              renderCard={card => {
                return (
                  <View style={styles.card}>
                    <Image
                      source={{ uri: BASE_URI + card.imgpath }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </View>
                )
              }}
              onSwiped={() => {
                this.setState({
                  currentIndex: currentIndex + 1
                })
              }}
              onSwipedAll={() => {
                console.log('onSwipedAll')
              }}
              cardIndex={0}
              cardVerticalMargin={0}
              backgroundColor={'transparent'}
              stackSize={1}
            />
          ) : (
            <></>
          )}
        </ImageBackground>
        <THButton
          style={{
            position: 'absolute',
            bottom: pxToDp(20),
            width: '80%',
            height: pxToDp(40),
            alignSelf: 'center'
          }}
          onPress={this.goAskPage}
        >
          开始测试
        </THButton>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    height: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: '#E8E8E8',
    justifyContent: 'center'
  }
})

export default Index
