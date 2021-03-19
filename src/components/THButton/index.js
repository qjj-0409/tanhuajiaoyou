import React, {Component} from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {pxToDp} from '../../utils/stylesKits';

class Index extends Component {
  static defaultProps = {
    style: {},
    textStyle: {},
  };
  render() {
    return (
      // 虽然加了borderRadius样式，但是没有显示出效果，原因是borderRadius加在了TouchableOpacity身上，但是LinearGradient组件会撑开盒子，所以给TouchableOpacity加上溢出隐藏overflow: 'hidden'
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          ...this.props.style,
          overflow: 'hidden',
        }}
        onPress={this.props.onPress}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['#9b63cd', '#e06988']}
          style={styles.linearGradient}>
          <Text style={{...styles.buttonText, ...this.props.textStyle}}>
            {this.props.children}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: pxToDp(15),
    paddingRight: pxToDp(15),
    borderRadius: pxToDp(5),
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: pxToDp(18),
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});

export default Index;
