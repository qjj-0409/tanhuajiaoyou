import React, { Component } from 'react'
import { Text, View, ImageBackground, Image } from 'react-native'
import {inject, observer} from 'mobx-react'

import request from '../../../../utils/request'
import { BASE_URI, FRIENDS_QUESTIONSECTION } from '../../../../utils/pathMap'
import THNav from '../../../../components/THNav'
import { pxToDp } from '../../../../utils/stylesKits'

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

  // 生命周期函数-组件挂载完毕后执行
  componentDidMount() {
    this.getList()
    console.log(this.props.UserStore.user)
  }
  render() {
    const question = this.props.route.params
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
              <Image source={{uri: BASE_URI + this.props.UserStore.user.header}} style={{width: pxToDp(40), height: pxToDp(40), borderRadius: pxToDp(20)}} />
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
        </ImageBackground>
      </View>
    )
  }
}

export default Index
