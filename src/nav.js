import React, { Component } from 'react'
import { Button, View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './pages/account/login'
import UserInfo from './pages/account/userinfo'
import Tabbar from './tabbar'
import TanHua from './pages/friend/tanhua'
import Search from './pages/friend/search'
import Demo from './pages/Demo'
import { inject, observer } from 'mobx-react'

const Stack = createStackNavigator()

@inject('RootStore')
@observer
class Nav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialRouteName: props.RootStore.token ? 'Search' : 'Login'
    }
  }
  render() {
    const { initialRouteName } = this.state
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode="none" initialRouteName={initialRouteName}>
          <Stack.Screen name="Demo" component={Demo} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="UserInfo" component={UserInfo} />
          <Stack.Screen name="Tabbar" component={Tabbar} />
          <Stack.Screen name="TanHua" component={TanHua} />
          <Stack.Screen name="Search" component={Search} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default Nav
