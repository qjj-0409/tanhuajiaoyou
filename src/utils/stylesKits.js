/**
 * 公式：设计稿的宽度 / 元素的宽度 = 手机屏幕 / 手机中元素的宽度
 * 手机中元素的宽度 = 手机屏幕 * 元素的宽度 / 设计稿的宽度
 *  这里暂定设计稿的宽度是375
 */
import { Dimensions } from 'react-native'

// 1.获取屏幕宽高
export const windowWidth = Dimensions.get('window').width
export const windowHeight = Dimensions.get('window').height

/**
 * 2.将px转为dp
 * @param {Number} elePx 设计稿中元素的宽度或者高度 单位 px
 * @returns 手机中元素的宽度或高度 单位 dp
 */
export const pxToDp = elePx => (windowWidth * elePx) / 375
