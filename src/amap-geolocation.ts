import { Platform, DeviceEventEmitter } from "react-native";
import { Location, ReGeocode, GeoLanguage } from "react-native-amap-geolocation/src/types";
import NativeRNAMapGeolocation from './NativeRNAMapGeolocation';
const AMapGeolocation = NativeRNAMapGeolocation;

/**
 * 初始化 SDK
 *
 * @param key 高德开放平台应用 Key
 */
export function init(key: string): Promise<void> {
  return AMapGeolocation.init(key);
}

/**
 * 添加定位监听函数
 *
 * @param listener
 */
export function addLocationListener(listener: (location: Location & ReGeocode) => void) {
  return DeviceEventEmitter.addListener('AMapGeolocation', listener);
}

/**
 * 开始持续定位
 */
export function start() {
  AMapGeolocation.start();
}

/**
 * 停止持续定位
 */
export function stop() {
  AMapGeolocation.stop();
}

/**
 * 设置发起定位请求的时间间隔（毫秒），默认 2000，最小值为 1000
 *
 * @default 2000
 */
export function setInterval(interval: number) {
  AMapGeolocation.setInterval(interval);
}

/**
 * 设置是否单次定位
 *
 * @default false
 */
export function setOnceLocation(isOnceLocation: boolean) {
  AMapGeolocation.setOnceLocation(isOnceLocation);
}

/**
 * 设置是否返回地址信息，默认返回地址信息
 *
 * GPS 定位时也可以返回地址信息，但需要网络通畅，第一次有可能没有地址信息返回。
 *
 * @default true
 */
export function setNeedAddress(isNeedAddress: boolean) {
  AMapGeolocation.setNeedAddress(isNeedAddress);
}

/**
 * 设置逆地理信息的语言，目前支持中文和英文
 *
 * @default GeoLanguage.DEFAULT
 */
export function setGeoLanguage(language: GeoLanguage) {
  AMapGeolocation.setGeoLanguage(language);
}

/**
 * 设定定位的最小更新距离（米）
 *
 * 默认为 `kCLDistanceFilterNone`，表示只要检测到设备位置发生变化就会更新位置信息。
 *
 */
export function setDistanceFilter(distance: number) {
  AMapGeolocation.setDistanceFilter(distance);
}

/**
 * 指定单次定位超时时间（秒）
 *
 * 最小值是 2s。注意在单次定位请求前设置。
 *
 * 注意: 单次定位超时时间从确定了定位权限（非 `kCLAuthorizationStatusNotDetermined` 状态）后开始计算。
 *
 * @default 10
 */
export function setLocationTimeout(timeout: number) {
  AMapGeolocation.setLocationTimeout(timeout);
}

interface Options {
  locatingWithReGeocode?: boolean;
}

export const _options: Options = {};