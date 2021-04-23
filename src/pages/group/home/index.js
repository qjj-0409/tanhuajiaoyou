import React from 'react';
import {
  Text,
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustormerBar from './components/CustormerBar'
import Recommend from './recommend'
import Latest from './latest'

export default () => {
  /**
   * renderTabBar：接受1个参数props，并返回一个组件作为标签栏使用。该组件将goToPage、tabs、activeTab和ref添加到props属性中，并且应该实现setAnimationValue，以便能够随着选项卡内容动画自己。您可以手动将props属性传递给选项卡组件。
   * initialPage：初始选择的选项卡的索引，默认为0 ===第一个选项卡。
   */
  return <ScrollableTabView
    initialPage={1}
    renderTabBar={() => <CustormerBar />}
  >
    <Recommend tabLabel="推荐" />
    <Latest tabLabel="最新" />
  </ScrollableTabView>;
}