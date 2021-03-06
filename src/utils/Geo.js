import { PermissionsAndroid, Platform } from 'react-native'
import { init, Geolocation } from 'react-native-amap-geolocation'
import axios from 'axios'
import Toast from './Toast'

class Geo {
  // 初始化
  async initGeo() {
    // 系统判断
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      )
    }
    await init({
      // 来自于高德地图中 探花-项目（Android平台） 应用中的key
      ios: '94f5d1d57b7e4a29ed3d599d48e57f05',
      android: '94f5d1d57b7e4a29ed3d599d48e57f05'
    })
    return Promise.resolve()
  }
  // 获取当前地理位置
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      console.log('开始定位')
      Geolocation.getCurrentPosition(({ coords }) => {
        resolve(coords)
      }, reject)
    })
  }
  // 根据地理位置获取城市定位
  async getCityByLocation() {
    Toast.showLoading('努力获取中')
    const { longitude, latitude } = await this.getCurrentPosition()
    const res = await axios.get('https://restapi.amap.com/v3/geocode/regeo', {
      params: {
        location: `${longitude},${latitude}`,
        // 来自高德地图中 web_api 应用中的key
        key: '0a0d9f7fea5b2cdfeef2ebdc55b5fbb9'
      }
    })
    Toast.hideLoading()
    return Promise.resolve(res.data)
  }
  // 根据城市获取地理位置
  async getCityPostion(address, city) {
    const res = await axios.get('https://restapi.amap.com/v3/geocode/geo', {
      params: {
        key: '0a0d9f7fea5b2cdfeef2ebdc55b5fbb9',
        address,
        city
      }
    })
    return Promise.resolve(res.data)
  }
}

export default new Geo()
