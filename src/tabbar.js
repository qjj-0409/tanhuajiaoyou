import React, { Component } from 'react'
import { View, Text } from 'react-native'
import TabNavigator from 'react-native-tab-navigator'
import SvgUri from 'react-native-svg-uri'
import {
  friend,
  selectedFriend,
  group,
  selectedGroup,
  message,
  selectedMessage,
  my,
  selectedMy
} from './res/fonts/iconSvg'
import {inject, observer} from 'mobx-react'

import Friend from './pages/friend/home'
import Group from './pages/group/home'
import Message from './pages/message/home'
import My from './pages/my/home'
import request from './utils/request'
import {MY_INFO} from './utils/pathMap'
import JMessage from './utils/JMessage'

@inject('UserStore')
@observer
class Tabbar extends Component {
  constructor(props) {
    super(props)
    if (props.route.params && props.route.params.pagename) {
      this.state.selectedTab = props.route.params.pagename
    }
  }
  state = {
    selectedTab: 'friend',
    pages: [
      {
        selected: 'friend',
        title: '交友',
        renderIcon: () => <SvgUri width="20" height="20" svgXmlData={friend} />,
        renderSelectedIcon: () => (
          <SvgUri width="20" height="20" svgXmlData={selectedFriend} />
        ),
        onPress: () => this.setState({ selectedTab: 'friend' }),
        component: <Friend />
      },
      {
        selected: 'group',
        title: '圈子',
        renderIcon: () => <SvgUri width="20" height="20" svgXmlData={group} />,
        renderSelectedIcon: () => (
          <SvgUri width="20" height="20" svgXmlData={selectedGroup} />
        ),
        onPress: () => this.setState({ selectedTab: 'group' }),
        component: <Group />
      },
      {
        selected: 'message',
        title: '消息',
        renderIcon: () => (
          <SvgUri width="20" height="20" svgXmlData={message} />
        ),
        renderSelectedIcon: () => (
          <SvgUri width="20" height="20" svgXmlData={selectedMessage} />
        ),
        onPress: () => this.setState({ selectedTab: 'message' }),
        component: <Message />
      },
      {
        selected: 'my',
        title: '我的',
        renderIcon: () => <SvgUri width="20" height="20" svgXmlData={my} />,
        renderSelectedIcon: () => (
          <SvgUri width="20" height="20" svgXmlData={selectedMy} />
        ),
        onPress: () => this.setState({ selectedTab: 'my' }),
        component: <My />
      }
    ]
  }

  async componentDidMount() {
    // 1.发送请求获取当前用户信息
    const res = await request.privateGet(MY_INFO)
    // 2.用户信息存入到mobx中
    this.props.UserStore.setUser(res.data)
    // 3.进行极光登录
    await JMessage.login(res.data.guid, res.data.mobile)
  }

  render() {
    const { selectedTab, pages } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <TabNavigator>
          {pages.map((v, i) => {
            return (
              <TabNavigator.Item
                key={i}
                selected={selectedTab === v.selected}
                title={v.title}
                renderIcon={v.renderIcon}
                renderSelectedIcon={v.renderSelectedIcon}
                onPress={v.onPress}
                selectedTitleStyle={{ color: '#c863b5' }}
                tabStyle={{
                  backgroundColor: '#f8f8f8',
                  justifyContent: 'center'
                }}
              >
                {v.component}
              </TabNavigator.Item>
            )
          })}
        </TabNavigator>
      </View>
    )
  }
}

export default Tabbar
