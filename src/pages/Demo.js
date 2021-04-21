import React from 'react'
import { View, Text, Image } from 'react-native'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { Overlay } from 'teaset'
import { pxToDp } from '../utils/stylesKits'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.overlayViewRef = null
    this.state = {
      textContent: "", // 动态内容
      longitude: "", // 经度
      latitude: "", // 纬度
      location: "", // 当前地址
      // 图片数组
      imageContent: [
        {
          headImgShortPath: "/upload/album/18665711978/1576633170560_0.9746430185850421.jpg"
        }
      ],
      tmpImgList: [] // 暂存图片
    }
  }
  openOverlay = () => {

    // 显示审核中的效果
    let overlayView = (
      /**
       * ref={v => (this.overlayView = v)}
       * 这段代码的意义：在创建组件的时候把组件的实例挂载到this.overlayView上
       */
      <Overlay.View
        style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, .1)', justifyContent: 'center' }}
        modal={false}
        overlayOpacity={0.5}
        ref={v => (this.overlayViewRef = v)}
      >
        <View
          style={{
            alignSelf: 'center',
            width: pxToDp(334),
            backgroundColor: '#fff',
            padding: pxToDp(15)
          }}
        >
          <Text style={{fontSize: pxToDp(20)}}>选择图片</Text>
          <Text
            style={{fontSize: pxToDp(16), marginTop: pxToDp(10)}}
            onPress={this.selectCamera}
          >拍照</Text>
          <Text style={{fontSize: pxToDp(16), marginTop: pxToDp(10)}}>相册</Text>
          <Text
            style={{alignSelf: 'flex-end', marginTop: pxToDp(10)}}
            onPress={this.closeOverlay}
          >取消</Text>
        </View>
      </Overlay.View>
    )
    Overlay.show(overlayView)

  }

  // 选择拍照
  selectCamera = () => {
    let options = {
      mediaType: 'photo'
    }
    launchCamera(options, (response) => {
      console.log("response", response)
      if(response.didCancel) {
        console.log('取消图片选择')
      } else if (response.errorCode) {
        console.log('错误描述信息', response.errorMessage)
      } else {
        // 限制图片的数量不能超过9
        const { tmpImgList } = this.state
        tmpImgList.push(response)
      }
    })
  }

  // 关闭浮层
  closeOverlay = () => {
    this.overlayViewRef.close()
  }

  render() {
    return (
      <View>
        <Text onPress={this.openOverlay}>浮层</Text>
      </View>
    )
  }
}
export default App
