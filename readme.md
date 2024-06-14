> 模板版本：v0.2.1

<p align="center">
  <h1 align="center"> <code>react-native-amap-geolocation</code> </h1>
</p>
<p align="center">
    <a href="https://github.com/qiuxiang/react-native-amap-geolocation">
        <img src="https://img.shields.io/badge/platforms-android%20|%20ios%20|%20harmony%20-lightgrey.svg" alt="Supported platforms" />
    </a>
    <a href="https://github.com/qiuxiang/react-native-amap-geolocation/blob/main/license">
        <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
        <!-- <img src="https://img.shields.io/badge/license-Apache-blue.svg" alt="License" /> -->
    </a>
</p>


> [!TIP] [Github 地址](https://github.com/react-native-oh-library/react-native-amap-geolocation) 



## 安装与使用

请到三方库的 Releases 发布地址查看配套的版本信息：[@react-native-oh-tpl/react-native-amap-geolocation Releases](https://github.com/react-native-oh-library/react-native-amap-geolocation/releases)，并下载适用版本的 tgz 包。

进入到工程目录并输入以下命令：

> [!TIP] # 处替换为 tgz 包的路径

<!-- tabs:start -->

#### **npm**

```bash
npm install @react-native-oh-tpl/react-native-amap-geolocation@file:#
```

#### **yarn**

```bash
yarn add @react-native-oh-tpl/react-native-amap-geolocation@file:#
```

<!-- tabs:end -->

下面的代码展示了这个库的基本使用场景：

```js
import * as React from "react";
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Geolocation from "@react-native-oh-tpl/react-native-amap-geolocation";

const style = StyleSheet.create({
  body: {
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 48 : 16,
  },
  controls: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row",
    marginBottom: 16,
  },
  button: {
    flexDirection: "column",
    marginRight: 8,
    marginBottom: 8,
    marginTop:50
  },
  result: {
    fontFamily: Platform.OS === "ios" ? "menlo" : "monospace",
  },
});

class AmapGeoLocationDemo extends React.Component {
  state = { location: null };


 componentDidMount(){
  Geolocation.init("aabbbcccc")
 }


start=()=>{
  console.log("geolocation start");
  Geolocation.start().then((result)=>{
      let location = result;
      this.setState({ location });
      console.log("geolocationupdateLocation:"+location);
  }).catch((error)=>{
      console.log(error);
  });
};
stop =()=>{
  console.log("geolocation stop");
  Geolocation.stop();
}

 onceLocation=  ()=>{
   Geolocation.setOnceLocation().then((result)=>{
    let location = result;
    this.setState({ location });
    console.log("geolocation onceLocation:"+location);
   }).catch((error)=>{
    console.log(error);
   });


};
getLastKnownLocation= () =>{
   Geolocation.getLastKnownLocation().then((result)=>{
    let location = result;
    this.setState({ location });
    console.log("geolocation lastLocation:"+location);
   }).catch((error)=>{
    console.log(error);
   });
}


stopUpdatingLocation=()=>{
  Geolocation.stopUpdatingLocation();
}
setInterval10000 = ()=>{
  Geolocation.setInterval(10000);
}
setInterval2000 = ()=>{
  Geolocation.setInterval(2000);
}
setNeedAddressTrue=()=>{
  Geolocation.setNeedAddress(true);
}
setNeedAddressFalse =()=>{
  Geolocation.setNeedAddress(false);
}

setLangeChinese=()=>{
   // default = 0,chinese = 1, engilish=2;
  Geolocation.setGeoLanguage(1);
}
setLangeEnglish=()=>{
  // default = 0,chinese = 1, engilish=2;
 Geolocation.setGeoLanguage(2);
}
render() {
  const { location } = this.state;
 return (

     <ScrollView contentContainerStyle={style.body}>
   
         <View style={style.button}>
           <Button onPress={this.start} title="start" />
         </View>
         <View style={style.button}>
           <Button onPress={this.stop} title="stop" />
         </View>
         <View style={style.button}>
           <Button onPress={this.onceLocation} title="setOnceLocation" />
         </View>
         <View style={style.button}>
           <Button onPress={this.getLastKnownLocation} title="getLastKnownLocation" />
         </View>
   
    
         <View style={style.button}>
           <Button onPress={this.setInterval2000} title="setInterval(2000)" />
         </View>
         <View style={style.button}>
           <Button onPress={this.setInterval10000} title="setInterval(10000)" />
         </View>
         <View style={style.button}>
           <Button onPress={this.setNeedAddressTrue} title="setNeedAddress(true)" />
         </View>
         <View style={style.button}>
           <Button onPress={this.setNeedAddressFalse} title="setNeedAddress(false)" />
         </View>
         <View style={style.button}>
           <Button onPress={this.setLangeChinese} title="setLangeChinese" />
         </View>
         <View style={style.button}>
           <Button onPress={this.setLangeEnglish} title="setLangeEnglish" />
         </View>
       <Text style={style.result}>{`${JSON.stringify(location, null, 2)}`}</Text> 

     </ScrollView>
   );
}

}

export default AmapGeoLocationDemo;
```

## Link

目前鸿蒙暂不支持 AutoLink，所以 Link 步骤需要手动配置。

首先需要使用 DevEco Studio 打开项目里的鸿蒙工程 `harmony`

### 在工程根目录的 `oh-package.json` 添加 overrides 字段

```json
{
  ...
  "overrides": {
    "@rnoh/react-native-openharmony" : "./react_native_openharmony"
  }
}
```

### 引入原生端代码

目前有两种方法：

1. 通过 har 包引入（在 IDE 完善相关功能后该方法会被遗弃，目前首选此方法）；
2. 直接链接源码。

方法一：通过 har 包引入（推荐）

> [!TIP] har 包位于三方库安装路径的 `harmony` 文件夹下。

打开 `entry/oh-package.json5`，添加以下依赖

```json
"dependencies": {
    "@rnoh/react-native-openharmony": "file:../react_native_openharmony",
    "@react-native-oh-tpl/react-native-amap-geolocation": "file:../../node_modules/@react-native-oh-tpl/react-native-amap-geolocation/harmony/amap_geolocation.har"
  }
```

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

方法二：直接链接源码

> [!TIP] 如需使用直接链接源码，请参考[直接链接源码说明](/zh-cn/link-source-code.md)

### 在 ArkTs 侧引入 IOS/Android Package

打开 `entry/src/main/ets/RNPackagesFactory.ts`，添加：

```diff
...
+ import {AmapGeolocationPackage} from '@react-native-oh-tpl/react-native-amap-geolocation';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new SamplePackage(ctx),
+   new AmapGeolocationPackage(ctx)
  ];
}
```

### 运行

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

然后编译、运行即可。

## 约束与限制

### 兼容性

要使用此库，需要使用正确的 React-Native 和 RNOH 版本。另外，还需要使用配套的 DevEco Studio 和 手机 ROM。

请到三方库相应的 Releases 发布地址查看 Release 配套的版本信息：[@react-native-oh-tpl/react-native-amap-geolocation Releases](https://github.com/react-native-oh-tpl/react-native-amap-geolocation/releases)

本文档内容基于以下版本验证通过：

1. RNOH：0.72.20; SDK：HarmonyOS NEXT Developer Beta1; IDE：DevEco Studio 5.0.3.200; ROM：3.0.0.18

## 属性

> [!tip] "Platform"列表示该属性在原三方库上支持的平台。

> [!tip] "HarmonyOS Support"列为 yes 表示 HarmonyOS 平台支持该属性；no 则表示不支持；partially 表示部分支持。使用方法跨平台一致，效果对标 iOS 或 Android 的效果。

| Name | Description | Type | Required | Platform | HarmonyOS Support  |
| ---- | ----------- | ---- | -------- | -------- | ------------------ |
| code  | 错误代码         | number  | yes | ios/Android      | yes |
| message  | 错误信息         | string  | yes | ios/Android      | yes |
| android  | Android平台         | string | yes | ios/Android      | yes |
| ios  | IOS平台         | string  | yes | ios/Android      | yes |
| accuracy  | 定位精度 (米)        | number  | yes | ios/Android      | yes |
| altitude  | 海拔（米），需要 GPS         | number  | yes | ios/Android      | yes |
| altitudeAccuracy  | 海拔精度         | number  | yes | ios/Android      | yes |
| latitude  | 经度，[-180, 180]         | number  | yes | ios/Android      | yes |
| longitude  | 纬度，[-90, 90]         | number  | yes | ios/Android      | yes |
| speed  | 移动速度（米/秒），需要 GPS         | number  | yes | ios/Android      | yes |
| coordinateType  | 坐标系类型       | string  | yes | Android      | yes |
| errorInfo  | 错误信息         | string | yes | ios/Android      | yes |
| heading  | 移动方向，需要 GPS         | number  | yes | ios/Android      | yes |
| locationDetail  | 定位信息描述         | string  | yes | Android      | yes |
| timestamp  | 定位时间（毫秒）         | number  | yes | ios/Android      | yes |
| distanceFilter  | 位置信息的距离过滤器，用于限制位置更新的触发频率         | number  | yes | ios/Android      | yes |
| enableHighAccuracy  | 是否启用高精度模式来获取位置信息。        | boolean | yes | ios/Android      | yes |
| maximumAge  | 获取位置信息的最大缓存时间        | number  | yes | ios/Android      | yes |
| timeout  |  获取位置信息的超时时间   | number  | yes | ios/Android      | yes |
| address  | 详细地址         | number  | yes | ios/Android      | yes |
|city  | 城市         | string  | yes | ios/Android      | yes |
| cityCode  | 城市编码        | string | yes | ios/Android      | yes |
| country  | 国家        | string  | yes | ios/Android      | yes |
| district  | 地区         | string  | yes | ios/Android      | yes |
| poiName | 兴趣点        | string  | yes | ios/Android      | yes |
| province  | 省份       | string  | yes | ios/Android      | yes |
| street  | 街道         | string | yes | ios/Android      | yes |
| streetNumber  | 门牌号        | string  | yes | ios/Android      | yes |


## API

> [!tip] "Platform"列表示该属性在原三方库上支持的平台。

> [!tip] "HarmonyOS Support"列为 yes 表示 HarmonyOS 平台支持该属性；no 则表示不支持；partially 表示部分支持。使用方法跨平台一致，效果对标 iOS 或 Android 的效果。

| Name | Description | Type | Required | Platform | HarmonyOS Support |
| ---- | ----------- | ---- | -------- | -------- |-------------------|
| init  | 初始化 SDK | Promise<void>  | yes| IOS/Android      | yes               |
| isStarted  | 获取当前是否正在定位的状态 | boolean | yes | Android      | no                |
| setAllowsBackgroundLocationUpdates  | 是否允许后台定位 | void  | yes | ios      | yes               |
| setDesiredAccuracy  | 设定期望的定位精度（米） | void  | yes | ios     | yes               |
| setDistanceFilter  | 设定定位的最小更新距离（米） | void  | yes | ios     | yes               |
| setGeoLanguage  | 设置逆地理信息的语言，目前支持中文和英文 | void  | yes | ios/Android      | yes               |
| setGpsFirst  | 设置首次定位是否等待卫星定位结果 | void  | yes | Android      | no                |
| setGpsFirstTimeout  | 设置优先返回卫星定位信息时等待卫星定位结果的超时时间（毫秒） | void  | yes | Android      | no                |
| setHttpTimeout  | 设置联网超时时间（毫秒） | void  | yes | Android      | no                |
| setInterval  | 设置发起定位请求的时间间隔（毫秒），默认 2000，最小值为 1000 | void  | yes | Android      | yes               |
| setLocatingWithReGeocode  | 连续定位是否返回逆地理编码 | void  | yes | ios      | yes               |
| setLocationCacheEnable  | 设置是否使用缓存策略 | void  | yes | Android     | no                |
| setLocationMode  | 设置定位模式 | void  | yes | Android     | no                |
| setLocationPurpose  | 设置定位场景 | void  | yes | Android      | no                |
| setLocationTimeout  | 指定单次定位超时时间（秒） | void  | yes | ios      | yes               |
| setMockEnable  | 设置是否允许模拟位置 | void  | yes | Android      | no                |
| setNeedAddress  | 设置是否返回地址信息，默认返回地址信息 | void  | yes | Android      | yes               |
| setOnceLocation  | 设置是否单次定位 | void  | yes | Android      | yes               |
| setOnceLocationLatest  | 设置定位是否等待 WiFi 列表刷新 | void  | yes | Android      | no                |
| setOpenAlwaysScanWifi  | 设置是否开启wifi始终扫描 | void  | yes | Android     | no                |
| setPausesLocationUpdatesAutomatically  | 指定定位是否会被系统自动暂停 | void  | yes | ios      | no                |
| setReGeocodeTimeout  | 指定单次定位逆地理超时时间（秒）最小值是 2s。注意在单次定位请求前设置。 | void  | yes | ios     | no                |
| setSensorEnable  | 设置是否使用设备传感器 | void  | yes | Android      | no                |
| setWifiScan  | 设置是否允许调用 WiFi 刷新 | void  | yes | Android      | no                |
| start  | 开始持续定位 | void  | yes | ios/Android      | yes               |
| stop  | 停止持续定位 | void  | yes | ios/Android      | yes               |

## 遗留问题

## 其他

## 开源协议

本项目基于 [The MIT License (MIT)](https://https://github.com/syanbo/react-native-amap-geolocation/LICENSE.md) ，请自由地享受和参与开源。
