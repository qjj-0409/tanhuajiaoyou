import { observable, action } from 'mobx'

class RootStore {
  // observable 表示数据可监控 表示是全局数据
  // es7的装饰器语法 原理：Object.defineProperty
  // 手机号码
  // @observable mobile = '13412000001'
  @observable mobile = ''
  // token
  // @observable token =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQ1MiwibmFtZSI6IjEzNDEyMDAwMDAxIiwiaWF0IjoxNjE2NjUyNTY4LCJleHAiOjE2NDI1NzI1Njh9.ZrBE0p8NHHBU_e0VU2xukA90rSQcCZpop3uz-QmXRJs'

  @observable token = ''
  // 用户的唯一ID
  // @observable userId = '134120000011616407837175'
  @observable userId = ''
  // action行为 表示 changeName是个可以修改全局共享数据的方法
  @action setUserInfo(mobile, token, userId) {
    this.mobile = mobile
    this.token = token
    this.userId = userId
  }
}

export default new RootStore()
