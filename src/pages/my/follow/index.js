import React from 'react';
import { View, Text } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustormerBar from './components/CustormerBar'

import FollowEach from './followEach'
import Ifollow from './Ifollow'
import FollowMe from './followMe'
import request from '../../../utils/request'
import { MY_LIKELIST } from '../../../utils/pathMap'

class Index extends React.Component {
  state = {
    likeeachlist: [], // 互相关注列表
    ilikelist: [], // 喜欢列表
    likemelist: [] // 粉丝列表
  }

  // 获取关注-喜欢-粉丝相关的数据
  getList = async () => {
    const res = await request.privateGet(MY_LIKELIST)
    const likeeachlist = res.data.likeeachlist
    const ilikelist = res.data.ilikelist
    const likemelist = res.data.likemelist
    this.setState({likeeachlist, ilikelist, likemelist})
  }

  componentDidMount() {
    this.getList()
  }

  render() {
    const index = this.props.route.params || 0
    const { likeeachlist, ilikelist, likemelist } = this.state
    /**
     * renderTabBar：接受1个参数props，并返回一个组件作为标签栏使用。该组件将goToPage、tabs、activeTab和ref添加到props属性中，并且应该实现setAnimationValue，以便能够随着选项卡内容动画自己。您可以手动将props属性传递给选项卡组件。
     * initialPage：初始选择的选项卡的索引，默认为0 ===第一个选项卡。
     */
    return <ScrollableTabView
      initialPage={index}
      renderTabBar={() => <CustormerBar />}
    >
      <FollowEach getList={this.getList} tabLabel="互相关注" likeeachlist={likeeachlist}></FollowEach>
      <Ifollow getList={this.getList} tabLabel="喜欢" ilikelist={ilikelist}></Ifollow>
      <FollowMe getList={this.getList} tabLabel="粉丝" likemelist={likemelist}></FollowMe>
    </ScrollableTabView>
  }
}
 
export default Index