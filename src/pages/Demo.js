import React, { Component } from 'react'
import { Text, StyleSheet } from 'react-native'

import { CodeField, Cursor } from 'react-native-confirmation-code-field'

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    // 修改单元格的边框，borderWidth所有的边框，borderBottomWidth下边框
    borderBottomWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
    color: '#9b63cd'
  },
  focusCell: {
    borderColor: '#9b63cd'
  }
})

class App extends Component {
  state = {
    vcodeTxt: ''
  }

  onVcodeChangeText = vcodeTxt => {
    this.setState({
      vcodeTxt
    })
  }

  render() {
    return (
      /*
        CodeField组件
          ref：操作元素
          {...props}：解构接收到的属性
          value：输入的值
          onChangeText：输入框值改变触发的事件
          cellCount：单元格的个数
          rootStyle：样式
          keyboardType：键盘类型，number-pad 数字键盘
          renderCell：单元格渲染所需的函数
          renderCell: (options: {symbol: string, index: number, isFocused: boolean}) => ReactElement
        */
      <CodeField
        value={this.state.vcodeTxt}
        onChangeText={this.onVcodeChangeText}
        cellCount={6}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
          >
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
    )
  }
}

export default App
