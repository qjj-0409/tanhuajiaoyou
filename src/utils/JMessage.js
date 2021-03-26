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
  // 注册
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
  }
}
