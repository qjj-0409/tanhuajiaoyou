import { observable, action } from 'mobx'

class RootStore {
  // observable 表示数据可监控 表示是全局数据
  // es7的装饰器语法 原理：Object.defineProperty
  // 手机号码
  @observable mobile = ''
  // @observable mobile = '15915900003'
  // token
  @observable token = ''
  // @observable token =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQ5NywibmFtZSI6IjE1OTE1OTAwMDAzIiwiaWF0IjoxNjE3MDA4MDI3LCJleHAiOjE2NDI5MjgwMjd9.KQqd3167XtEO7iXIquuwcdHQdzpkYnfcAHPNQ44vnck'
  // 用户的唯一ID
  @observable userId = ''
  // @observable userId = '159159000031617008018572'
  // action行为 表示 changeName是个可以修改全局共享数据的方法
  @action setUserInfo(mobile, token, userId) {
    this.mobile = mobile
    this.token = token
    this.userId = userId
  }
}

export default new RootStore()
