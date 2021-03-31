import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import SvgUri from 'react-native-svg-uri'
import Picker from 'react-native-picker'
import { Slider } from 'react-native-elements'

import IconFont from '../../../../components/IconFont'
import { pxToDp } from '../../../../utils/stylesKits'
import { male, female } from '../../../../res/fonts/iconSvg'
import CityJson from '../../../../res/citys.json'
import THButton from '../../../../components/THButton'

class FilterPanel extends Component {
  // gender: '男', // 性别
  // distance: 2, // 距离，单位：米
  // lastLogin: '', // 近期登陆时间 15分钟，1天，1小时，不限制 四个类型
  // city: '', // 居住地
  // education: '' // 学历
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
    this.setState({
      gender
    })
  }

  // 选择近期登录时间
  chooseLastLogin = () => {
    Picker.init({
      pickerData: ['15分钟', '1天', '1小时', '不限制'], // 可选数据项
      selectedValue: [this.state.lastLogin], // 选中的值
      wheelFlex: [1, 0, 0], // 显示省和市
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择近期登录时间',
      onPickerConfirm: data => {
        this.setState({
          lastLogin: data[0]
        })
      }
    })
    Picker.show()
  }

  // 选择居住地
  chooseCity = () => {
    Picker.init({
      pickerData: CityJson, // 可选数据项
      selectedValue: ['北京', '北京', '丰台区'], // 选中的值
      wheelFlex: [1, 1, 1], // 显示省 市 区
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择居住地',
      onPickerConfirm: data => {
        this.setState({
          city: data[1]
        })
      }
    })
    Picker.show()
  }

  // 选择学历
  chooseEducation = () => {
    Picker.init({
      pickerData: ['博士后', '博士', '硕士', '本科', '高中', '留学', '其他'], // 可选数据项
      selectedValue: [this.state.education], // 选中的值
      wheelFlex: [1, 0, 0], // 显示省 市 区
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择学历',
      onPickerConfirm: data => {
        this.setState({
          education: data[0]
        })
      }
    })
    Picker.show()
  }

  // 确认提交数据
  handleSubmitFilter = () => {
    this.props.onSubmitFilter(this.state)
    // 关闭弹出层
    this.props.onClose()
  }

  render() {
    const { gender, lastLogin, distance, city, education } = this.state
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
        {/* 3.0 近期登陆时间 开始 */}
        <View style={styles.itemView}>
          <Text
            style={{
              ...styles.itemTitle,
              width: pxToDp(140)
            }}
          >
            近期登录时间：
          </Text>
          <Text style={styles.itemText} onPress={this.chooseLastLogin}>
            {lastLogin || '请选择'}
          </Text>
        </View>
        {/* 3.0 近期登陆时间 结束 */}
        {/* 4.0 距离 开始 */}
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
            <Text style={styles.itemText}>{distance || 0} km</Text>
          </View>
          <Slider
            value={distance}
            onValueChange={distance => this.setState({ distance })}
            maximumValue={10}
            minimumValue={0}
            step={0.5}
            thumbStyle={{
              height: 20,
              width: 20
            }}
          />
        </View>
        {/* 4.0 距离 结束 */}
        {/* 5.0 居住地 开始 */}
        <View style={styles.itemView}>
          <Text style={{ ...styles.itemTitle, width: pxToDp(100) }}>
            居住地：
          </Text>
          <Text style={styles.itemText} onPress={this.chooseCity}>
            {city || '请选择'}
          </Text>
        </View>
        {/* 5.0 居住地 结束 */}
        {/* 6.0 学历 开始 */}
        <View style={styles.itemView}>
          <Text style={{ ...styles.itemTitle, width: pxToDp(60) }}>学历：</Text>
          <Text style={styles.itemText} onPress={this.chooseEducation}>
            {education || '请选择'}
          </Text>
        </View>
        {/* 6.0 学历 结束 */}
        {/* 7.0 确认按钮 开始 */}
        <THButton
          style={{ height: pxToDp(40), marginTop: pxToDp(10) }}
          onPress={this.handleSubmitFilter}
        >
          确认
        </THButton>
        {/* 7.0 确认按钮 结束 */}
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
