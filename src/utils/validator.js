export default {
  /**
   * 校验手机号码
   * @param {Number} phone 手机号
   * @returns 是否合法
   */
  validatePhone(phone) {
    const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
    return reg.test(phone)
  },
  /**
   * 匹配富文本
   * @param {String} text 富文本内容
   */
  renderRichText(text) {
    // 声明最终要拿到的数组
    const finalList = []
    // 定义一下正则，加 ? 使匹配在 } 之前停止
    const rule = /(\/\{.+?\})/g
    // 匹配后的图片字符的数组
    const emoArr = text.match(rule)
    // 如果使普通文本，没有表情图像
    if (emoArr === null) {
      finalList.push({text: text})
    } else {
      // 将文本转换成如下格式的数组：
      // 广东人以后￥￥搞笑￥￥￥￥吃饭
      // ["广东人以后", "搞笑", "", "吃饭"]
      const textArr = text.replace(rule, "￥￥").split('￥￥')
      while(textArr.length) {
        finalList.push({text: textArr.shift()})
        if (emoArr.length) {
          finalList.push({image: emoArr.shift()})
        }
      }
    }
    return finalList
  }
}
