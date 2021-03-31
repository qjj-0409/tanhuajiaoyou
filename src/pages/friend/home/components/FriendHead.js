import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import SvgUri from 'react-native-svg-uri'
import { tanhua, near, testSoul } from '../../../../res/fonts/iconSvg'
import { pxToDp } from '../../../../utils/stylesKits'

class FriendHead extends Component {
  render() {
    return (
      <View style={styles.container}>
        {/* 1.探花 开始 */}
        <TouchableOpacity style={styles.touchItem}>
          <View style={{ ...styles.itemView, backgroundColor: '#fe5012' }}>
            <SvgUri width={40} height={40} fill="#fff" svgXmlData={tanhua} />
          </View>
          <Text style={styles.itemText}>探花</Text>
        </TouchableOpacity>
        {/* 1.探花 结束 */}
        {/* 2.搜附近 开始 */}
        <TouchableOpacity style={styles.touchItem}>
          <View style={{ ...styles.itemView, backgroundColor: '#2db3f8' }}>
            <SvgUri width={40} height={40} fill="#fff" svgXmlData={near} />
          </View>
          <Text style={styles.itemText}>搜附近</Text>
        </TouchableOpacity>
        {/* 2.搜附近 结束 */}
        {/* 3.测灵魂 开始 */}
        <TouchableOpacity style={styles.touchItem}>
          <View style={{ ...styles.itemView, backgroundColor: '#ecc768' }}>
            <SvgUri width={40} height={40} fill="#fff" svgXmlData={testSoul} />
          </View>
          <Text style={styles.itemText}>测灵魂</Text>
        </TouchableOpacity>
        {/* 3.测灵魂 结束 */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around'
  },
  touchItem: {
    alignItems: 'center'
  },
  itemView: {
    width: pxToDp(60),
    height: pxToDp(60),
    borderRadius: pxToDp(30),
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    fontSize: pxToDp(16),
    marginTop: pxToDp(4),
    color: '#ffffff9a'
  }
})

export default FriendHead
