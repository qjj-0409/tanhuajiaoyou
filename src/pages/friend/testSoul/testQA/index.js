import React, { Component } from 'react'
import {
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity
} from 'react-native'
import { inject, observer } from 'mobx-react'
import LinearGradient from 'react-native-linear-gradient'

import request from '../../../../utils/request'
import { BASE_URI, FRIENDS_QUESTIONSECTION, FRIENDS_QUESTIONANS } from '../../../../utils/pathMap'
import THNav from '../../../../components/THNav'
import { pxToDp } from '../../../../utils/stylesKits'
import Toast from '../../../../utils/Toast'

@inject('UserStore')
@observer
class Index extends Component {
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
  state = {
    questionList: [], // 测试题问卷列表数据
    currentIndex: 0 // 当前题目索引
  }

  // 答案列表
  ansList = []

  // 右侧图标映射关系
  titles = {
    "初级": require('../../../../res/leve1.png'),
    "中级": require('../../../../res/leve2.png'),
    "高级": require('../../../../res/leve3.png')
  }

  // 获取测试题列表
  getList = async () => {
    const url = FRIENDS_QUESTIONSECTION.replace(
      ':id',
      this.props.route.params.qid
    )
    const res = await request.privateGet(url)
    this.setState({
      questionList: res.data
    })
  }

  // 数字转化映射关系
  getFont = number => {
    let numCN = ''
    switch (number) {
      case 1:
        numCN = '一'
        break
      case 2:
        numCN = '二'
        break
      case 3:
        numCN = '三'
        break
      case 4:
        numCN = '四'
        break
      default:
        numCN = number
        break
    }
    return numCN
  }

  // 选择答案
  chooeseAns = async (ans) => {
    const { currentIndex, questionList } = this.state
    this.ansList.push(ans)
    if (currentIndex >= questionList.length - 1) {
      // 最后一题，提交答案
      const url = FRIENDS_QUESTIONANS.replace(':id', this.props.route.params.qid)
      const answers = this.ansList.join(',')
      const res = await request.privatePost(url, {answers})
      if (res.code === '10000') {
        this.props.navigation.navigate('TestResult', res.data)
      } else {
        Toast.sad('答案提交失败，请重新提交！', 'center', 2000)
      }
    } else {
      this.setState({
        currentIndex: currentIndex + 1
      })
    }
  }

  // 生命周期函数-组件挂载完毕后执行
  componentDidMount() {
    this.getList()
  }
  render() {
    const {currentIndex, questionList} = this.state
    const question = this.props.route.params
    // 获取用户信息
    const user = this.props.UserStore.user
    if (!questionList[currentIndex]) return <></>
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', position: 'relative' }}>
        <THNav title={question.title} />
        <ImageBackground
          source={require('../../../../res/qabg.png')}
          style={{ width: '100%', height: '100%' }}
        >
          {/* 1.0 两侧图标 开始 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: pxToDp(60)
            }}
          >
            {/* 左侧图标 */}
            <ImageBackground
              style={{
                width: pxToDp(66),
                height: pxToDp(52),
                justifyContent: 'center',
                alignItems: 'flex-end',
                paddingRight: pxToDp(6)
              }}
              source={require('../../../../res/qatext.png')}
            >
              <Image
                source={{ uri: BASE_URI + user.header }}
                style={{
                  width: pxToDp(40),
                  height: pxToDp(40),
                  borderRadius: pxToDp(20)
                }}
              />
            </ImageBackground>
            {/* 右侧图标 */}
            <ImageBackground
              style={{
                width: pxToDp(66),
                height: pxToDp(52),
                justifyContent: 'center',
                alignItems: 'flex-end'
              }}
              source={this.titles[question.type]}
            />
          </View>
          {/* 1.0 两侧图标 结束 */}
          {/* 2.0 测试题 开始 */}
          <View
            style={{
              position: 'absolute',
              width: '80%',
              top: pxToDp(60),
              alignSelf: 'center',
              alignItems: 'center'
            }}
          >
            <View>
              <Text style={{ color: '#fff', fontSize: pxToDp(26) }}>
                第{this.getFont(currentIndex + 1)}题
              </Text>
              <Text
                style={{
                  color: '#ffffff9a',
                  fontSize: pxToDp(14),
                  textAlign: 'center'
                }}
              >
                ({currentIndex + 1}/{questionList.length})
              </Text>
            </View>
            <Text
              style={{
                color: '#fff',
                fontSize: pxToDp(16),
                marginTop: pxToDp(20)
              }}
            >
              {questionList[currentIndex].question_title}
            </Text>
            {/* 3.0 答案 开始 */}
            <View style={{ width: '100%' }}>
              {
                questionList[currentIndex].answers.map((v, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      style={{marginTop: pxToDp(10)}}
                      onPress={this.chooeseAns.bind(this, v.ans_No)}
                    >
                      <LinearGradient
                        style={{
                          height: pxToDp(40),
                          borderRadius: pxToDp(10),
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        colors={['#6f45f3', '#e76b7e']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={{ color: '#fff', fontSize: pxToDp(16) }}>
                          {v.ans_title}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )
                })
              }
            </View>
            {/* 3.0 答案 结束 */}
          </View>
          {/* 2.0 测试题 结束 */}
        </ImageBackground>
      </View>
    )
  }
}

export default Index
