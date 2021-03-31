import React from 'react'
import { Text } from 'react-native'
import iconMap from '../../res/fonts/icon'

const Index = props => {
  return (
    <Text
      style={{ fontFamily: 'iconfont', ...props.style }}
      onPress={props.onPress}
    >
      {iconMap[props.name]}
    </Text>
  )
}

export default Index
