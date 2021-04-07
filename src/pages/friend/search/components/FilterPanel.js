import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import SvgUri from 'react-native-svg-uri'
import { Slider } from 'react-native-elements'

import IconFont from '../../../../components/IconFont'
import { pxToDp } from '../../../../utils/stylesKits'
import { male, female } from '../../../../res/fonts/iconSvg'
import THButton from '../../../../components/THButton'

class FilterPanel extends Component {
  // gender: '男', // 性别
  // distance: 2, // 距离，单位：米
  constructor(props) {
    super(props)
    /**
     * this.props.params 是一个对象，引用类型
     * 如果直接赋值给state，那么稍后修改state，props数据也会修改
     * 所以为了防止props数据被修改，将this.props.params进行如下转换
     * 深拷贝：JSON.parse(JSON.stringify(this.props.params))
     */
    this.state = JSON.parse(JSON.stringify(this.props.params))
  }

  // 选择性别
  chooseGender(gender) {
    if (gender === this.state.gender) {
      gender = ''
    }
    this.setState({
      gender
    })
  }

  // 确认提交数据
  handleSubmitFilter = () => {
    this.props.onSubmitFilter(this.state)
    // 关闭弹出层
    this.props.onClose()
  }

  render() {
    const { gender, distance } = this.state
    return (
      <View style={styles.container}>
        {/* 1.0 标题 开始 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: pxToDp(50),
            alignItems: 'center'
          }}
        >
          <Text />
          <Text
            style={{ color: '#999', fontSize: pxToDp(20), fontWeight: 'bold' }}
          >
            筛选
          </Text>
          <IconFont
            name="iconshibai"
            style={{ fontSize: pxToDp(20) }}
            onPress={this.props.onClose}
          />
        </View>
        {/* 1.0 标题 结束 */}
        {/* 2.0 性别 开始 */}
        <View style={styles.itemView}>
          <Text
            style={{
              ...styles.itemTitle,
              width: pxToDp(60)
            }}
          >
            性别：
          </Text>
          {/* 性别图标 开始 */}
          <View
            style={{
              width: '40%',
              flexDirection: 'row',
              alignSelf: 'center',
              justifyContent: 'space-around'
            }}
          >
            <TouchableOpacity
              onPress={this.chooseGender.bind(this, '男')}
              style={{
                width: pxToDp(40),
                height: pxToDp(40),
                backgroundColor: gender === '男' ? 'red' : '#eee',
                borderRadius: pxToDp(20),
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <SvgUri svgXmlData={male} width="36" height="36" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.chooseGender.bind(this, '女')}
              style={{
                width: pxToDp(40),
                height: pxToDp(40),
                backgroundColor: gender === '女' ? 'red' : '#eee',
                borderRadius: pxToDp(20),
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <SvgUri svgXmlData={female} width="36" height="36" />
            </TouchableOpacity>
          </View>
          {/* 性别图标 结束 */}
        </View>
        {/* 2.0 性别 结束 */}
        {/* 3.0 距离 开始 */}
        <View
          style={{
            marginTop: pxToDp(10),
            justifyContent: 'center',
            height: pxToDp(50)
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ ...styles.itemTitle, width: pxToDp(60) }}>
              距离：
            </Text>
            <Text style={styles.itemText}>{distance || 0} m</Text>
          </View>
          <Slider
            value={distance}
            onValueChange={distance => this.setState({ distance })}
            maximumValue={100000}
            minimumValue={0}
            step={1}
            thumbStyle={{
              height: 20,
              width: 20
            }}
          />
        </View>
        {/* 3.0 距离 结束 */}
        {/* 4.0 确认按钮 开始 */}
        <THButton
          style={{ height: pxToDp(40), marginTop: pxToDp(10) }}
          onPress={this.handleSubmitFilter}
        >
          确认
        </THButton>
        {/* 4.0 确认按钮 结束 */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '70%',
    left: 0,
    bottom: 0,
    backgroundColor: '#fff',
    padding: pxToDp(10)
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: pxToDp(10),
    height: pxToDp(50)
  },
  itemTitle: {
    color: '#7d7d7d',
    fontSize: pxToDp(16)
  },
  itemText: {
    color: '#9b9b9b',
    fontSize: pxToDp(16)
  }
})

export default FilterPanel
