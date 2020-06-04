/**
 * @export public
 * @doc_name 常用UI组件
 * @doc_index 1
 * @doc_directory ui
 * @deprecated 10005; since 10005 TitleBarBlack was deprecated, use TitleBar instead.
 * @module miot/ui/TitleBarBlack
 * @description 黑色标题栏
 * @property leftTextStyle 左侧文字样式，和 leftText 一起使用，不设置使用米家默认值
 * @property leftText 左侧文字
 * @property onPressLeft 左侧点击事件，设置了才显示左侧文字或图片，如果设置了leftText则显示设置的文字，否则显示默认的返回按钮。
 * @property onPressLeft2 左侧的第二个点击事件，设置了才显示默认的关闭按钮，
 * @property rightTextStyle 右侧文字样式，和 rightText 一起使用，不设置使用米家默认值
 * @property rightText 右侧文字
 * @property onPressRight 右侧点击事件，设置了才显示右侧文字或图片，如果设置了 rightText 则显示设置的文字，否则显示默认的更多按钮。
 * @property onPressRight2 右侧的第二个点击事件，设置了才显示默认的分享按钮
 * @property title 中间的标题
 * @property subTitle  中间的子标题
 * @property onPressTitle 点击标题的事件
 * @property showDot 是否显示右侧更多按钮的空点
 */
import React, { Component } from 'react';
import { Dimensions, Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { RkButton } from "react-native-ui-kitten";
import { SafeAreaView } from 'react-navigation';
import ImageButton from './ImageButton';
import PropTypes from 'prop-types';
import { AccessibilityRoles, AccessibilityPropTypes, getAccessibilityConfig } from 'miot/utils/accessibility-helper';
const { width } = Dimensions.get('window');
const titleHeight = 44;
const imgHeight = 28;
export default class TitleBarBlack extends Component {
  static propTypes = {
    leftTextStyle: PropTypes.any,
    rightTextStyle: PropTypes.any,
    style: PropTypes.any,
    leftText: PropTypes.string,
    rightText: PropTypes.string,
    onPressLeft: PropTypes.func,
    onPressLeft2: PropTypes.func,
    onPressRight: PropTypes.func,
    onPressRight2: PropTypes.func,
    onPressTitle: PropTypes.func,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    showDot: PropTypes.bool,
    accessible: AccessibilityPropTypes.accessible,
    // 无障碍 - onPressLeft
    leftAccessibilityLabel: AccessibilityPropTypes.accessibilityLabel,
    leftAccessibilityHint: AccessibilityPropTypes.accessibilityHint,
    leftAccessibilityState: AccessibilityPropTypes.accessibilityState,
    // 无障碍 - onPressLeft2
    left2AccessibilityLabel: AccessibilityPropTypes.accessibilityLabel,
    left2AccessibilityHint: AccessibilityPropTypes.accessibilityHint,
    left2AccessibilityState: AccessibilityPropTypes.accessibilityState,
    // 无障碍 - onPressRight
    rightAccessibilityLabel: AccessibilityPropTypes.accessibilityLabel,
    rightAccessibilityHint: AccessibilityPropTypes.accessibilityHint,
    rightAccessibilityState: AccessibilityPropTypes.accessibilityState,
    // 无障碍 - onPressRight2
    right2AccessibilityLabel: AccessibilityPropTypes.accessibilityLabel,
    right2AccessibilityHint: AccessibilityPropTypes.accessibilityHint,
    right2AccessibilityState: AccessibilityPropTypes.accessibilityState
  };
  constructor(props) {
    super(props);
  }
  render() {
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS == 'android') {
      StatusBar.setTranslucent(true);
    }
    let leftWidth = this.props.leftTextStyle ? this.props.leftTextStyle.width : 0;
    let rightWidth = this.props.rightTextStyle ? this.props.rightTextStyle.width : 0;
    return (
      <SafeAreaView style={[styles.titleBarContainer, this.props.style]}>
        {this.props.leftText ? (
          <RkButton onPress={this.props.onPressLeft}
            contentStyle={[styles.leftRightText, this.props.leftTextStyle]}
            style={[styles.leftRightText, { height: this.props.onPressLeft ? titleHeight : 0, width: leftWidth ? leftWidth : imgHeight + 14 * 2 }]}
            {...getAccessibilityConfig({
              accessible: this.props.onPressLeft ? this.props.accessible : false,
              accessibilityRole: AccessibilityRoles.button,
              accessibilityLabel: this.props.leftAccessibilityLabel || this.props.leftText,
              accessibilityHint: this.props.leftAccessibilityHint,
              accessibilityState: this.props.leftAccessibilityState
            })}
          >{this.props.leftText}</RkButton>
        ) : (
          <ImageButton onPress={this.props.onPressLeft}
            style={[styles.img, { height: this.props.onPressLeft ? imgHeight : 0 }]}
            source={require('../resources/title/std_tittlebar_main_device_back_normal.png')}
            highlightedSource={require('../resources/title/std_tittlebar_main_device_back_press.png')}
            {...getAccessibilityConfig({
              accessible: this.props.onPressLeft ? this.props.accessible : false,
              accessibilityRole: AccessibilityRoles.imagebutton,
              accessibilityLabel: this.props.leftAccessibilityLabel,
              accessibilityHint: this.props.leftAccessibilityHint,
              accessibilityState: this.props.leftAccessibilityState
            })}
          />
        )}
        <ImageButton onPress={this.props.onPressLeft2}
          style={[styles.img, {
            marginLeft: 0,
            height: this.props.onPressLeft2 ? imgHeight : 0
          }]}
          source={require('../resources/title/std_tittlebar_main_device_back2_normal.png')}
          highlightedSource={require('../resources/title/std_tittlebar_main_device_back2_press.png')}
          {...getAccessibilityConfig({
            accessible: this.props.onPressLeft2 ? this.props.accessible : false,
            accessibilityRole: AccessibilityRoles.imagebutton,
            accessibilityLabel: this.props.left2AccessibilityLabel,
            accessibilityHint: this.props.left2AccessibilityHint,
            accessibilityState: this.props.left2AccessibilityState
          })}
        />
        <View style={[styles.textContainer]} {...getAccessibilityConfig({
          accessible: this.props.accessible,
          accessibilityRole: AccessibilityRoles.header
        })}>
          <Text
            style={[styles.titleText]}
            onPress={this.props.onPressTitle}>{this.props.title}</Text>
          {
            this.props.subTitle ? <Text
              style={[styles.subtitleText]}
              onPress={this.props.onPressTitle}>{this.props.subTitle}</Text> : <View />
          }
        </View>
        <ImageButton onPress={this.props.onPressRight2}
          style={[styles.img, {
            marginRight: 0,
            height: this.props.onPressRight2 ? imgHeight : 0
          }]}
          source={require('../resources/title/std_tittlebar_main_device_share_normal.png')}
          highlightedSource={require('../resources/title/std_tittlebar_main_device_share_press.png')}
          {...getAccessibilityConfig({
            accessible: this.props.onPressRight2 ? this.props.accessible : false,
            accessibilityRole: AccessibilityRoles.imagebutton,
            accessibilityLabel: this.props.right2AccessibilityLabel,
            accessibilityHint: this.props.right2AccessibilityHint,
            accessibilityState: this.props.right2AccessibilityState
          })}
        />
        {this.props.rightText ? (
          <RkButton onPress={this.props.onPressRight}
            contentStyle={[styles.leftRightText, this.props.rightTextStyle]}
            style={[styles.leftRightText, { height: this.props.onPressRight ? titleHeight : 0, width: rightWidth ? rightWidth : imgHeight + 14 * 2 }]}
            {...getAccessibilityConfig({
              accessible: this.props.onPressRight ? this.props.accessible : false,
              accessibilityRole: AccessibilityRoles.button,
              accessibilityLabel: this.props.rightAccessibilityLabel || this.props.rightText,
              accessibilityHint: this.props.rightAccessibilityHint,
              accessibilityState: this.props.rightAccessibilityState
            })}
          >{this.props.rightText}</RkButton>
        ) : (
          <ImageButton onPress={this.props.onPressRight}
            style={[styles.img, { height: this.props.onPressRight ? imgHeight : 0 }]}
            source={require('../resources/title/std_tittlebar_main_device_more_normal.png')}
            highlightedSource={require('../resources/title/std_tittlebar_main_device_more_press.png')}
            {...getAccessibilityConfig({
              accessible: this.props.onPressRight ? this.props.accessible : false,
              accessibilityRole: AccessibilityRoles.imagebutton,
              accessibilityLabel: this.props.rightAccessibilityLabel,
              accessibilityHint: this.props.rightAccessibilityHint,
              accessibilityState: this.props.rightAccessibilityState
            })}
          />
        )}
        {
          this.props.showDot &&
          <Image style={styles.dot}
            source={require('../resources/title/std_tittlebar_main_device_massage_point.png')} />
        }
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  titleBarContainer: {
    flexDirection: 'row',
    width: width,
    alignItems: 'flex-end',
    height: (StatusBar.currentHeight || 0) + titleHeight
  },
  textContainer: {
    height: titleHeight,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  titleText: {
    color: '#000000cc',
    fontSize: 15,
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  subtitleText: {
    color: '#00000088',
    fontSize: 12,
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  leftRightText: {
    flexDirection: 'column',
    backgroundColor: '#0000',
    color: '#00000088',
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: "center",
    textAlign: "center"
  },
  img: {
    width: imgHeight,
    height: imgHeight,
    resizeMode: 'contain',
    marginLeft: 14,
    marginTop: (titleHeight - 28) / 2,
    marginBottom: (titleHeight - 28) / 2,
    marginRight: 14
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    resizeMode: 'contain',
    right: 14,
    top: (StatusBar.currentHeight || 0) + (titleHeight - 28) / 2
  }
});