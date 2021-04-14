import JMessage from 'jmessage-react-plugin'

export default {
  // 初始化
  init() {
    JMessage.init({
      appkey: '971e2501c588feda9ee0917b', // 极光官网上注册的应用 Appkey
      isOpenMessageRoaming: true, // 是否开启消息漫游，默认不开启
      isProduction: false, // 是否为生产模式
      channel: '' // 应用的渠道名称
    })
  },
  /**
   * 注册
   * @param {string} username this.props.UserStore.guid (159159000031617008018572)
   * @param {string} password this.props.UserStore.mobile (15915900003)
   * @returns 
   */
  register(username, password) {
    return new Promise((resolve, reject) => {
      JMessage.register(
        {
          username,
          password
        },
        resolve,
        reject
      )
    })
  },
  // 登录
  login(username, password) {
    return new Promise((resolve, reject) => {
      JMessage.login(
        {
          username,
          password
        },
        resolve,
        reject
      )
    })
  },
  /**
   * 发送文本消息
   * @param {string} username 接收信息的对象
   * @param {string} text 信息文本内容
   * @param {object} extras 附带的参数
   * @returns 
   */
  sendTextMessage(username, text, extras = {}) {
    return new Promise((resolve, reject) => {
      /**
       * JMessage.sendTextMessage({参数配置}, callback成功回调, callback失败回调)
       * type：消息类型，single（单个）
       * username：接收信息的对象
       * appKey：对方用户所属应用的 AppKey。如果不填，默认为当前应用
       * text：信息文本内容
       * extras：附带的参数，必须是对象，对象键的值，不能是对象，必须通过JSON.stringify()转化为字符串
       * messageSendingOptions：消息发送配置参数（只对 Android 生效）
       */
      JMessage.sendTextMessage({
        type: 'single',
        username,
        text,
        extras
      }, resolve, reject)
    })
  }
}
