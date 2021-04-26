import React, { Component } from 'react'
import { Text, View, TextInput } from 'react-native'

import IconFont from '../../../../components/IconFont'
import { pxToDp } from '../../../../utils/stylesKits'

class SearchInput extends Component {
  render() {
    return (
      <View
        style={{
          height: pxToDp(40),
          borderRadius: pxToDp(20),
          backgroundColor: '#fff',
          position: 'relative',
          ...this.props.style
        }}
      >
        <TextInput
          placeholder="搜索用户"
          style={{paddingLeft: pxToDp(30), color: '#666', fontSize: pxToDp(14)}}
          value={this.props.value}
          onChangeText={this.props.onChangeText}
        />
        <IconFont name="iconsousuo" style={{position: 'absolute', left: pxToDp(10), top: pxToDp(14), color: '#87929c'}} />
      </View>
    )
  }
}

export default SearchInput
