import { Device, Host, DeviceEvent, Service } from 'miot';
// import {Device,DeviceEvent} from 'miot'
// import {Host} from 'miot';
import PropTypes from 'prop-types';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { RkButton } from 'react-native-ui-kitten';
import { strings, Styles } from '../../resources';
import ListItem from '../ListItem/ListItem';
import Separator from '../Separator';
import { AccessibilityPropTypes, AccessibilityRoles, getAccessibilityConfig } from '../../utils/accessibility-helper';
let modelType = '';
function getModelType() {
  return new Promise((resolve) => {
    if (modelType) {
      resolve(modelType);
      return;
    }
    Service.spec.getSpecString(Device.deviceID).then((instance) => {
      if (instance && instance.type) {
        modelType = instance.type.split(':')[3];
        resolve(modelType);
        return;
      }
      resolve(Device.model ? Device.model.split('.')[1] : '');
    }).catch(() => {
      resolve(Device.model ? Device.model.split('.')[1] : '');
    });
  });
}
getModelType().then(() => { }).catch(() => { });
// 2020/02/04 灯组2.0需求，去掉cn的判断
// let countryCode = '';
// function getCountryCode() {
//   return new Promise((resolve, reject) => {
//     if (countryCode) {
//       resolve(countryCode);
//       return;
//     }
//     Service.getServerName().then(({ countryCode }) => {
//       countryCode = (countryCode || '').toLowerCase();
//       resolve(countryCode);
//     }).catch(reject);
//   });
// }
// getCountryCode().then(() => { }).catch(() => { });
const firstOptions = {
  /**
   * 按键设置，多键开关`必选`，其余设备`必不选`
   */
  MEMBER_SET: 'memberSet',
  /**
   * 设备共享, `可选`
   */
  SHARE: 'share',
  /**
   * 蓝牙网关, `可选`
   */
  BTGATEWAY: 'btGateway',
  /**
   * 语音授权, `可选`
   */
  VOICE_AUTH: 'voiceAuth',
  /**
   * 智能场景, `可选`
   */
  IFTTT: 'ifttt',
  /**
   * 固件升级，`可选`
   */
  FIRMWARE_UPGRADE: 'firmwareUpgrade',
  /**
   * 新建设备组
   */
  CREATE_GROUP: 'createGroup',
  /**
   * 管理设备组
   */
  MANAGE_GROUP: 'manageGroup'
};
const firstAllOptions = {
  ...firstOptions,
  /**
   * 设备名称，`必选`
   */
  NAME: 'name',
  /**
   * 位置管理，`必选`
   */
  LOCATION: 'location',
  /**
   * 使用帮助，`必选`
   */
  HELP: 'help',
  /**
   * 更多设置，`必选`
   */
  MORE: 'more',
  /**
   * 安全设置，`必选`
   */
  SECURITY: 'security',
  /**
   * 法律信息，`必选`
   */
  LEGAL_INFO: 'legalInfo'
};
/**
 * 分享设备的设置项
 * 0: 不显示
 * 1: 显示
 */
const firstSharedOptions = {
  [firstAllOptions.NAME]: 0,
  [firstAllOptions.MEMBER_SET]: 0,
  [firstAllOptions.LOCATION]: 0,
  [firstAllOptions.SHARE]: 0,
  [firstAllOptions.BTGATEWAY]: 0,
  [firstAllOptions.VOICE_AUTH]: 0,
  [firstAllOptions.IFTTT]: 0,
  [firstAllOptions.FIRMWARE_UPGRADE]: 0,
  [firstAllOptions.CREATE_GROUP]: 0,
  [firstAllOptions.MANAGE_GROUP]: 0,
  [firstAllOptions.MORE]: 1,
  [firstAllOptions.HELP]: 1,
  [firstAllOptions.SECURITY]: 0,
  [firstAllOptions.LEGAL_INFO]: 0 // 20190516，分享设备不显示「法律信息」
};
/**
 * 20190708 / SDK_10023
 * 所有设置项顺序固定
 * 权重值越大，排序越靠后，为了可扩展性，权重不能依次递增+1
 */
const firstAllOptionsWeight = {
  [firstAllOptions.NAME]: 0,
  [firstAllOptions.CREATE_GROUP]: 1,
  [firstAllOptions.MANAGE_GROUP]: 1,
  [firstAllOptions.MEMBER_SET]: 3,
  [firstAllOptions.LOCATION]: 6,
  [firstAllOptions.SHARE]: 9,
  [firstAllOptions.BTGATEWAY]: 12,
  [firstAllOptions.VOICE_AUTH]: 15,
  [firstAllOptions.IFTTT]: 18,
  [firstAllOptions.FIRMWARE_UPGRADE]: 21,
  [firstAllOptions.MORE]: 24,
  [firstAllOptions.HELP]: 27,
  [firstAllOptions.SECURITY]: 28,
  [firstAllOptions.LEGAL_INFO]: 30
};
/**
 * 某些特殊设备类型不显示某些设置项
 * key: 设置项的key
 * value: 不显示该设置项的设备类型列表, 用 pid 表示设备类型, [] 表示支持所有设备
 * 0:  wifi单模设备
 * 1:  yunyi设备
 * 2:  云接入设备
 * 3:  zigbee设备
 * 5:  虚拟设备
 * 6:  蓝牙单模设备
 * 7:  本地AP设备
 * 8:  蓝牙wifi双模设备
 * 9:  其他
 * 10: 功能插件
 * 11: SIM卡设备
 * 12: 网线设备
 * 13: NB-IoT
 * 14: 第三方云接入
 * 15: 红外遥控器
 * 16: BLE Mesh
 * 17: 虚拟设备（新设备组）
 */
const excludeOptions = {
  [firstAllOptions.NAME]: [],
  [firstAllOptions.MEMBER_SET]: [],
  [firstAllOptions.LOCATION]: [],
  [firstAllOptions.SHARE]: [],
  [firstAllOptions.BTGATEWAY]: [],
  [firstAllOptions.VOICE_AUTH]: [],
  [firstAllOptions.IFTTT]: [],
  [firstAllOptions.FIRMWARE_UPGRADE]: [],
  [firstAllOptions.CREATE_GROUP]: ['17'],
  [firstAllOptions.MANAGE_GROUP]: [],
  [firstAllOptions.MORE]: [],
  [firstAllOptions.HELP]: [],
  [firstAllOptions.SECURITY]: [],
  [firstAllOptions.LEGAL_INFO]: ['5', '15', '17'] // 新增策略：灯组、红外遥控器等虚拟设备不显示法律信息，20190619
};
const secondOptions = {
  /**
   * 固件升级——固件自动升级, `可选`
   */
  AUTO_UPGRADE: 'autoUpgrade',
  /**
   * 更多设置——设备时区, `可选`
   */
  TIMEZONE: 'timezone',
  /**
   * 法律信息——加入用户体验计划, `可选`
   */
  USER_EXPERIENCE_PROGRAM: 'userExperienceProgram'
};
const secondAllOptions = {
  ...secondOptions,
  /**
   * 固件升级——检查固件更新，`必选`
   */
  CHECK_UPGRADE: 'checkUpgrade',
  /**
   * 更多设置——安全设置，`必选`
   */
  SECURITY: 'security',
  /**
   * 更多设置——反馈问题，`必选`
   */
  FEEDBACK: 'feedback',
  /**
   * 更多设置——添加桌面快捷方式，`必选`
   */
  ADD_TO_DESKTOP: 'addToDesktop',
  /**
   * 法律信息——用户协议，`必选`
   */
  USER_AGREEMENT: 'userAgreement',
  /**
   * 法律信息——隐私政策，`必选`
   */
  PRIVACY_POLICY: 'privacyPolicy'
};
export const SETTING_KEYS = {
  // 一级菜单
  first_options: firstOptions,
  // 二级菜单
  second_options: secondOptions
};
export { firstAllOptions, secondAllOptions };
/**
 * @export public
 * @doc_name 通用设置
 * @doc_index 3
 * @doc_directory ui
 * @author Geeook
 * @since 10004
 * @module CommonSetting
 * @description 米家通用设置项
 * @property {array} firstOptions - 一级菜单列表项的keys，keys的顺序代表显示的顺序，不传将显示全部，传空数组将显示必选项
 * @property {array} secondOptions - 二级菜单列表项的keys，keys的顺序代表显示的顺序，不传将显示全部，传空数组将显示必选项
 * @property {array} showDot - 定义哪些列表项需要显示小红点。为了便于扩展每个列表项都可以显示小红点，默认全部**不显示**，需要显示传入该列表项的key即可。
 * @property {object} extraOptions - 其他特殊配置项
 * ```js
 * // extraOptions
 * extraOptions: {
 *   showUpgrade: bool // 「固件升级」是否跳转原生固件升级页面。默认值true。一般来说，wifi设备跳转原生固件升级页面，蓝牙设备（传入bleOtaAuthType除外）不跳转原生固件升级页面
 *   upgradePageKey: string // 「固件升级」如果不跳转原生固件升级页面，请传入想跳转页面的key(定义在 index.js 的 RootStack 中)
 *   licenseUrl: 资源id, // 见 miot/Host.ui.privacyAndProtocolReview 的传参说明，SDK_10023 开始废弃
 *   policyUrl: 资源id, // 见 miot/Host.ui.privacyAndProtocolReview 的传参说明，SDK_10023 开始废弃
 *   deleteDeviceMessage: string // 删除设备的弹窗中自定义提示文案，见 miot/Host.ui.openDeleteDevice 的传参说明
 *   ZXhjbHVkZVJlcXVpcmVkT3B0aW9ucw==: [] // %E5%A6%82%E6%9E%9C%E6%83%B3%E8%A6%81%E5%B1%8F%E8%94%BD%E5%BF%85%E9%80%89%E9%A1%B9%EF%BC%8C%E5%9C%A8%E8%BF%99%E9%87%8C%E4%BC%A0%E5%85%A5%20key%20%E5%8D%B3%E5%8F%AF%EF%BC%8C%E4%B8%80%E7%BA%A7%20or%20%E4%BA%8C%E7%BA%A7%E8%8F%9C%E5%8D%95%E7%9A%84%20key%20%E9%83%BD%E5%8F%AF%E4%BB%A5%E3%80%82%E7%89%B9%E6%AE%8A%E9%9C%80%E8%A6%81%EF%BC%8C%E8%B0%A8%E6%85%8E%E4%BD%BF%E7%94%A8
 *   option: object // 见 miot/Host.ui.previewLegalInformationAuthorization 的传参说明
 *   syncDevice: bool // 插件端设置时区后是否需要后台同步到设备端, 见 miot/Host.ui.openDeviceTimeZoneSettingPage 的传参说明
 *   networkInfoConfig: number // 「更多设置」页面是否显示「网络信息」设置项。0：不显示；1：显示；-1：米家默认配置（蓝牙设备不显示，Wi-Fi设备显示）
 *   bleOtaAuthType: number // 打开通用的蓝牙固件OTA的原生页面。指定设备的协议类型 0: 普通小米蓝牙协议设备(新接入设备已废弃该类型)，1: 安全芯片小米蓝牙设备（比如锁类产品） 4: Standard Auth 标准蓝牙认证协议(通常2019.10.1之后上线的新蓝牙设备) 5: mesh 设备
 * }
 * ```
 * @property {object} navigation - 必须传入当前插件的路由，即 `this.props.navigation`，否则无法跳转二级页面
 * **注意：**
 * **1. 如果需要显示「更多设置」「固件升级」的二级菜单页面，需要从 miot/ui/CommonSetting 中导出 MoreSetting 和 FirmwareUpgrade 页面，**
 *    **并放在项目入口文件index.js的RootStack中。**
 * ```js
 * // index.js snippet
 * import { FirmwareUpgrade, MoreSetting } from "miot/ui/CommonSetting";
 * ...
 * const RootStack = createStackNavigator(
 * {
 *     Setting, // 设置页
 *     MoreSetting, // 二级菜单——更多设置
 *     FirmwareUpgrade, // 二级菜单——固件升级
 * }
 * ...
 * )
 * ```
 * **2. 必须传入当前插件的路由，即 `this.props.navigation`，否则无法跳转二级页面**
 * ```js
 * <CommonSetting
 *   navigation={this.props.navigation}
 * />
 * ```
 * @see com.xiaomi.demo->教程->插件通用设置项
 */
export default class CommonSetting extends React.Component {
  static propTypes = {
    firstOptions: PropTypes.array,
    secondOptions: PropTypes.array,
    showDot: PropTypes.array,
    extraOptions: PropTypes.object,
    navigation: PropTypes.object.isRequired,
    accessible: AccessibilityPropTypes.accessible
  }
  static defaultProps = {
    firstOptions: [
      firstAllOptions.MEMBER_SET,
      firstAllOptions.SHARE,
      firstAllOptions.BTGATEWAY,
      firstAllOptions.VOICE_AUTH,
      firstAllOptions.IFTTT,
      firstAllOptions.FIRMWARE_UPGRADE,
      firstAllOptions.CREATE_GROUP,
      firstAllOptions.MANAGE_GROUP
    ],
    secondOptions: [
      secondAllOptions.AUTO_UPGRADE,
      secondAllOptions.TIMEZONE,
      secondAllOptions.USER_EXPERIENCE_PROGRAM
    ],
    showDot: [],
    extraOptions: {}
  }
  getCommonSetting(state) {
    let { modelType } = state || {};
    if (!modelType) {
      modelType = '  ';
    }
    let ret = {
      [firstAllOptions.NAME]: {
        title: strings.name,
        value: state.name,
        onPress: () => Host.ui.openChangeDeviceName()
      },
      [firstAllOptions.LOCATION]: {
        title: strings.location,
        onPress: () => Host.ui.openRoomManagementPage()
      },
      [firstAllOptions.MEMBER_SET]: {
        title: strings.memberSet,
        onPress: () => Host.ui.openPowerMultikeyPage(Device.deviceID, Device.mac)
      },
      [firstAllOptions.SHARE]: {
        title: strings.share,
        onPress: () => Host.ui.openShareDevicePage()
      },
      [firstAllOptions.BTGATEWAY]: {
        title: strings.btGateway,
        onPress: () => Host.ui.openBtGatewayPage()
      },
      [firstAllOptions.VOICE_AUTH]: {
        title: strings.voiceAuth,
        onPress: () => Host.ui.openVoiceCtrlDeviceAuthPage()
      },
      [firstAllOptions.IFTTT]: {
        title: strings.ifttt,
        onPress: () => Host.ui.openIftttAutoPage()
      },
      [firstAllOptions.HELP]: {
        title: strings.help,
        onPress: () => Host.ui.openHelpPage()
      },
      [firstAllOptions.FIRMWARE_UPGRADE]: {
        title: strings.firmwareUpgrade,
        onPress: () => this.chooseFirmwareUpgrade()
      },
      [firstAllOptions.CREATE_GROUP]: {
        title: strings[`create${ modelType[0].toUpperCase() }${ modelType.slice(1) }Group`],
        onPress: () => this.createGroup()
      },
      [firstAllOptions.MANAGE_GROUP]: {
        title: strings[`manage${ modelType[0].toUpperCase() }${ modelType.slice(1) }Group`],
        onPress: () => this.manageGroup()
      },
      [firstAllOptions.MORE]: {
        title: strings.more,
        onPress: () => this.openSubPage('MoreSetting')
      },
      [firstAllOptions.LEGAL_INFO]: {
        title: strings.legalInfo,
        onPress: () => this.privacyAndProtocolReview()
      }
    };
    // 2020/4/20 锁类和保险箱类，安全设置从更多设置中移出来
    if (['lock', 'safe-box'].indexOf(modelType) !== -1) {
      ret[firstAllOptions.SECURITY] = {
        title: strings.security,
        onPress: () => Host.ui.openSecuritySetting()
      };
    }
    return ret;
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      name: Device.name,
      showDot: Array.isArray(props.showDot) ? props.showDot : [],
      // countryCode,
      modelType
    };
    console.log(`Device.type: ${ Device.type }`);
    this.commonSetting = this.getCommonSetting(this.state);
  }
  UNSAFE_componentWillReceiveProps(props) {
    this.setState({ showDot: props.showDot });
  }
  /**
   * @description 点击「法律信息」，传入用户协议和隐私政策的文件地址
   */
  privacyAndProtocolReview() {
    const { licenseUrl, policyUrl, option } = this.props.extraOptions;
    if (option === undefined) { // 兼容旧写法
      Host.ui.privacyAndProtocolReview('', licenseUrl, '', policyUrl);
    } else {
      Host.ui.previewLegalInformationAuthorization(option);
    }
  }
  /**
   * @description 点击「固件升级」，选择性跳转
   */
  chooseFirmwareUpgrade() {
    // 默认是wifi设备固件升级的原生页面
    const { showUpgrade, upgradePageKey, bleOtaAuthType } = this.props.extraOptions;
    let { modelType } = this.state;
    Device.needUpgrade = false;
    if (showUpgrade === false) {
      // 蓝牙统一OTA界面
      if (upgradePageKey === undefined) {
        console.warn('请在 extraOptions.upgradePageKey 中填写你想跳转的固件升级页面, 传给 CommonSetting 组件');
        return;
      }
      if (typeof upgradePageKey !== 'string') {
        console.warn('upgradePageKey 必须是字符串, 是你在 index.js 的 RootStack 中定义的页面 key');
        return;
      }
      this.removeKeyFromShowDot(firstAllOptions.FIRMWARE_UPGRADE);
      this.openSubPage(upgradePageKey, {}); // 跳转到开发者指定页面
      console.warn('蓝牙统一OTA界面正在火热开发中');
    } else {
      // wifi设备固件升级
      // this.openSubPage('FirmwareUpgrade');
      // 20190516，「固件自动升级」不能做成通用功能所以去掉，
      // 那么二级页面「FirmwareUpgrade」只剩下「检查固件升级」一项，遂藏之
      this.removeKeyFromShowDot(firstAllOptions.FIRMWARE_UPGRADE);
      if (Device.type === '16') { // mesh device
        Host.ui.openBleMeshDeviceUpgradePage();
      } else if (Device.type === '17' && ['light'].indexOf(modelType) !== -1) {
        // 2019/11/21 新灯组2.0需求
        // 虚拟组设备，跳v2.0固件更新页
        Host.ui.openLightGroupUpgradePage();
      } else if ([0, 1, 4, 5].includes(bleOtaAuthType)) {
        Host.ui.openBleCommonDeviceUpgradePage({ auth_type: bleOtaAuthType });
      } else {
        Host.ui.openDeviceUpgradePage();
      }
    }
  }
  /**
   * 创建组设备
   */
  createGroup() {
    Host.ui.openMeshDeviceGroupPage('add', Device.deviceID, 2);
  }
  /**
   * 管理组设备
   */
  manageGroup() {
    Host.ui.openMeshDeviceGroupPage('edit', Device.deviceID, 2);
  }
  /**
   * @description 从 this.state.showDot 移除某key，从而隐藏小红点
   * @param {string} key
   */
  removeKeyFromShowDot(key) {
    const showDotTmp = [...this.state.showDot];
    const index = showDotTmp.indexOf(key);
    if (index !== -1) {
      showDotTmp.splice(index, 1);
      this.setState({ showDot: showDotTmp });
    } else {
      if (key === firstAllOptions.FIRMWARE_UPGRADE) {
        this.forceUpdate();
      }
    }
  }
  /**
   * @description 打开二级菜单
   * @param {string} page index.js的RootStack中页面定义的key
   */
  openSubPage(page, params = { networkInfoConfig: this.props.extraOptions.networkInfoConfig, syncDevice: this.props.extraOptions.syncDevice, secondOptions: this.props.secondOptions, excludeRequiredOptions: this.props.extraOptions.excludeRequiredOptions }) {
    let excludeRequiredOptions = params.excludeRequiredOptions || [];
    if (this.props.navigation) {
      this.props.navigation.navigate(page, {
        ...params,
        // 2020/4/20 锁类和保险箱类，去掉更多设置页中的安全设置
        excludeRequiredOptions: (['lock', 'safe-box'].indexOf(this.state.modelType) !== -1 && excludeRequiredOptions.indexOf(secondAllOptions.SECURITY) === -1) ? [...excludeRequiredOptions, secondAllOptions.SECURITY] : excludeRequiredOptions
      });
    } else {
      console.warn("props 'navigation' is required for CommonSetting");
    }
  }
  /**
   * @description 弹出「删除设备」弹窗
   */
  openDeleteDevice() {
    const { deleteDeviceMessage } = this.props.extraOptions;
    Host.ui.openDeleteDevice(deleteDeviceMessage);
  }
  componentDidMount() {
    // getCountryCode().then(countryCode => {
    //   this.setState({
    //     countryCode
    //   });
    // }).catch(() => { });
    getModelType().then((modelType) => {
      this.commonSetting = this.getCommonSetting({
        ...this.state,
        modelType
      });
      this.setState({
        modelType
      });
    }).catch(() => { });
  }
  render() {
    let { modelType } = this.state;
    // 如果不设置英文字体，那么外文字符串将显示不全（Android）
    let fontFamily = {};
    if (Platform.OS === 'android') fontFamily = { fontFamily: 'Kmedium' };
    let requireKeys1 = [firstAllOptions.NAME, firstAllOptions.LOCATION];
    // 创建组设备
    // 蓝牙单模和组设备不能创建
    if (['6', '17'].indexOf(Device.type) === -1 && ['light'].indexOf(modelType) !== -1) {
      requireKeys1.push(firstAllOptions.CREATE_GROUP);
    }
    // 管理组设备
    if (Device.type === '17' && ['light'].indexOf(modelType) !== -1) {
      requireKeys1.push(firstAllOptions.MANAGE_GROUP);
    }
    const requireKeys2 = [
      firstAllOptions.MORE,
      firstAllOptions.HELP,
      firstAllOptions.SECURITY,
      firstAllOptions.LEGAL_INFO
    ];
    // 2. 去掉杂质
    let options = this.props.firstOptions.filter((key) => key && Object.values(firstOptions).includes(key));
    // 3. 去除重复
    options = [...new Set(options)];
    // 4. 拼接必选项和可选项
    let keys = [...requireKeys1, ...options, ...requireKeys2];
    // 4.5 所有设置项顺序固定，20190708 / SDK_10023
    keys.sort((keyA, keyB) => firstAllOptionsWeight[keyA] - firstAllOptionsWeight[keyB]);
    // 5. 权限控制，如果是共享设备或者家庭设备，需要过滤一下
    if (Device.isOwner === false) {
      keys = keys.filter((key) => firstSharedOptions[key]);
    }
    // 6. 根据设备类型进一步过滤
    keys = keys.filter((key) => !excludeOptions[key].includes(Device.type));
    // 7. %E6%A0%B9%E6%8D%AE%E5%BC%80%E5%8F%91%E8%80%85%E7%89%B9%E6%AE%8A%E9%9C%80%E8%A6%81%EF%BC%8C%E9%9A%90%E8%97%8F%E6%9F%90%E4%BA%9B%E5%BF%85%E9%80%89%E9%A1%B9
    const { excludeRequiredOptions } = this.props.extraOptions;
    if (excludeRequiredOptions instanceof Array) {
      keys = keys.filter((key) => !excludeRequiredOptions.includes(key));
    }
    // 8. 根据最终的设置项 keys 渲染数据
    const items = keys.map((key) => {
      const item = this.commonSetting[key];
      if (item) {
        item.showDot = (this.state.showDot || []).includes(key);
        // 如果是固件升级设置项，且开发者没有传入是否显示
        if (key === firstAllOptions.FIRMWARE_UPGRADE && !item.showDot) {
          item.showDot = Device.needUpgrade;
        }
      }
      return item;
    }).filter((item) => item); // 防空
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{strings.commonSetting}</Text>
        </View>
        <Separator style={{ marginLeft: Styles.common.padding }} />
        {
          items.map((item, index) => {
            if (!item) return null;
            const showSeparator = index !== items.length - 1;
            return (
              <ListItem
                key={item.title}
                title={item.title || ''}
                showDot={item.showDot || false}
                value={item.value}
                onPress={item.onPress}
                showSeparator={showSeparator}
                {...getAccessibilityConfig({
                  accessible: this.props.accessible
                })}
              />
            );
          })
        }
        <Separator />
        {!Device.isFamily ?
          (<View style={styles.bottomContainer} {...getAccessibilityConfig({
            accessible: this.props.accessible,
            accessibilityRole: AccessibilityRoles.button
          })}>
            <RkButton
              style={styles.buttonContainer}
              onPress={() => this.openDeleteDevice()}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, fontFamily]}>
                {Device.type === '17' && Device.isOwner ? (strings[`delete${ (Device.model || '').split('.')[1][0].toUpperCase() }${ (Device.model || '').split('.')[1].slice(1) }Group`]) : strings.deleteDevice}
              </Text>
            </RkButton>
          </View>) : null}
      </View>
    );
  }
  UNSAFE_componentWillMount() {
    this._deviceNameChangedListener = DeviceEvent.deviceNameChanged.addListener((device) => {
      // this.state.name = device.name;
      // this.commonSetting = this.getCommonSetting(this.state);
      // this.forceUpdate();
      this.commonSetting = this.getCommonSetting({
        ...this.state,
        name: device.name
      });
      this.setState({
        name: device.name
      });
    });
  }
  componentWillUnmount() {
    this._deviceNameChangedListener.remove();
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor: '#fff'
  },
  titleContainer: {
    height: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingLeft: Styles.common.padding
  },
  title: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.5)',
    lineHeight: 14
  },
  bottomContainer: {
    height: 90,
    backgroundColor: Styles.common.backgroundColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    flex: 1,
    height: 55,
    borderRadius: 5,
    borderWidth: 0.3,
    borderColor: 'rgba(0,0,0,0.2)',
    backgroundColor: '#fff',
    marginHorizontal: Styles.common.padding
  },
  buttonText: {
    fontSize: 13,
    fontWeight: 'bold',
    // fontFamily: 'MI-LANTING--GBK1-Bold',
    flex: 1,
    textAlign: 'center',
    color: '#F43F31',
    lineHeight: 18
  }
});