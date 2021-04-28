import { observable, action } from 'mobx'

class UserStore {
  // observable 表示数据可监控 表示是全局数据
  // es7的装饰器语法 原理：Object.defineProperty
  // 用户信息
  @observable user = {}
//   {
//     "Distance": 46122.3,
//     "address": "广东省广州市天河区",
//     "age": 20,
//     "amount": null,
//     "birthday": "2021-02-13T16:00:00.000Z",
//     "city": "广州市",
//     "email": null,
//     "gender": "男",
//     "guid": "159159123451591501526289",
//     "header": "/upload/161330212260415915912345.jpg",
//     "id": 63,
//     "lat": 23,
//     "lng": 113,
//     "login_time": "2021-04-06T03:53:14.000Z",
//     "marry": "单身",
//     "mobile": "15915912345",
//     "nick_name": "M",
//     "status": 0,
//     "vcode": "888888",
//     "xueli": "大专"
// }

  // action行为 表示 changeName是个可以修改全局共享数据的方法
  @action setUser(user) {
    this.user = user
  }

  // 清除用户信息
  @action clearUser() {
    this.user = {}
  }
}

export default new UserStore()
