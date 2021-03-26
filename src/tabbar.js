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
import Friend from './pages/friend/home'
import Group from './pages/group/home'
import Message from './pages/message/home'
import My from './pages/my/home'

class Tabbar extends Component {
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
