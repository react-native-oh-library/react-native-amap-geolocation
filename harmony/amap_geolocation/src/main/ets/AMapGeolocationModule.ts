/**
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { TurboModule, TurboModuleContext } from "@rnoh/react-native-openharmony/ts";
import hilog from '@ohos.hilog';
import { TM } from '@rnoh/react-native-openharmony/generated/ts';
import {
  IAMapLocationListener,
  AMapLocationManagerImpl,
  AMapLocationOption,
  AMapLocation
} from '../../../IndexMap';

import abilityAccessCtrl, { PermissionRequestResult } from '@ohos.abilityAccessCtrl';
import common from '@ohos.app.ability.common';
import { AMapPrivacyShowStatus, AMapPrivacyInfoStatus, AMapPrivacyAgreeStatus, } from '../../../IndexMap';

import { AMapLocationReGeocodeLanguage } from '../../../IndexMap';

import { CommonConstants } from './CommonConstants'
import geoLocationManager from '@ohos.geoLocationManager';
import systemDateTime from '@ohos.systemDateTime';
import { AMapLocationType } from '../../../IndexMap';
import bundleManager from '@ohos.bundle.bundleManager';
import { Permissions } from '@ohos.abilityAccessCtrl';
import { e45 } from '../../../IndexMap';

import { BusinessError } from '@ohos.base';
import { Context } from '@kit.AbilityKit';

export class AMapGeolocationModule extends TurboModule implements IAMapLocationListener, TM.RNAMapGeolocation.Spec {
  private options: AMapLocationOption | null = null;
  private client: AMapLocationManagerImpl | null = null;
  private context: TurboModuleContext | null = null;
  private reGeocodeLanguage: AMapLocationReGeocodeLanguage = AMapLocationReGeocodeLanguage.Chinese;
  private interval: number = 5;
  private result: string = ''
  private errorMessage: string = ''

  constructor(ctx: TurboModuleContext) {
    super(ctx);

    hilog.debug(0xcc00, '[RNOH]', ':FileUpLoadModule constructor');
    this.options = {
      priority: geoLocationManager.LocationRequestPriority.FIRST_FIX,
      scenario: geoLocationManager.LocationRequestScenario.UNSET,
      maxAccuracy: 0,
      singleLocationTimeout: 3000,
      allowsBackgroundLocationUpdates: false,
      locatingWithReGeocode: false,
      reGeocodeLanguage: AMapLocationReGeocodeLanguage.Chinese,
      isOffset: false
    }

  }

  onLocationChanged(location: AMapLocation): void {
    this.result = JSON.stringify(location);
    this.ctx.rnInstance.emitDeviceEvent(
      "AMapGeolocation",
      this.toJSON(location)
    )
  };

  onLocationError(locationErrorInfo: e45): void {
    this.errorMessage = JSON.stringify(locationErrorInfo);
  };

  requestPermissions(): void {
    let atManager = abilityAccessCtrl.createAtManager();
    try {

      atManager.requestPermissionsFromUser(this.ctx.uiAbilityContext, CommonConstants.REQUEST_PERMISSIONS)
        .then((data) => {
          console.error('AMapGeolocation requestPermissionsFromUser')

          if (data.authResults[0] !== 0 || data.authResults[1] !== 0) {
            console.error('AMapGeolocation requestPermissionsFromUser return')
            return;
          }
          const that = this;

        })
        .catch((err: Error) => {
          console.error('AMapGeolocation requestPermissionsFromUser err' + JSON.stringify(err))
        })
    } catch (err) {
      console.error('AMapGeolocation requestPermissionsFromUser err' + JSON.stringify(err));
    }
  }

  async checkAccessToken(permission: Permissions): Promise<abilityAccessCtrl.GrantStatus> {
    let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
    let grantStatus: abilityAccessCtrl.GrantStatus = abilityAccessCtrl.GrantStatus.PERMISSION_DENIED;

    // 获取应用程序的accessTokenID
    let tokenId: number = 0;
    try {
      let bundleInfo: bundleManager.BundleInfo =
        await bundleManager.getBundleInfoForSelf(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
      let appInfo: bundleManager.ApplicationInfo = bundleInfo.appInfo;
      tokenId = appInfo.accessTokenId;
    } catch (error) {
      let err: BusinessError = error as BusinessError;
      console.error(`AMapGeolocation Failed to get bundle info for self. Code is ${err.code}, message is ${err.message}`);
    }

    // 校验应用是否被授予权限
    try {
      grantStatus = await atManager.checkAccessToken(tokenId, permission);
    } catch (error) {
      let err: BusinessError = error as BusinessError;
      console.error(`AMapGeolocation Failed to check access token. Code is ${err.code}, message is ${err.message}`);
    }

    return grantStatus;
  }

  async checkPermissions(): Promise<void> {
    const permissions: Array<Permissions> = ['ohos.permission.LOCATION'];
    let grantStatus: abilityAccessCtrl.GrantStatus = await this.checkAccessToken(permissions[0]);

    if (grantStatus === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED) {
      // 已经授权，可以继续访问目标操作
    } else {
      // 申请日历权限
      const permissions: Array<Permissions> = ['ohos.permission.LOCATION'];

      this.reqPermissionsFromUser(CommonConstants.REQUEST_PERMISSIONS);
    }
  }

  reqPermissionsFromUser(permissions: Array<Permissions>): void {
    let context: ESObject = this.ctx.uiAbilityContext;
    let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
    // requestPermissionsFromUser会判断权限的授权状态来决定是否唤起弹窗
    atManager.requestPermissionsFromUser(context, permissions).then((data: PermissionRequestResult) => {
      let grantStatus: Array<number> = data.authResults;
      let length: number = grantStatus.length;
      for (let i = 0; i < length; i++) {
        if (grantStatus[i] === 0) {
          // 用户授权，可以继续访问目标操作
        } else {
          // 用户拒绝授权，提示用户必须授权才能访问当前页面的功能，并引导用户到系统设置中打开相应的权限
          // this.openPermissionsInSystemSettings()
          return;
        }
      }
      // 授权成功
    }).catch((err: BusinessError) => {
      console.error(`Failed to request permissions from user. Code is ${err.code}, message is ${err.message}`);
    })
  }

  init(key: string) {
    let context: common.UIAbilityContext = this.ctx.uiAbilityContext;
    this.checkPermissions();
    if (this.client != null) {
      this.client.stopContinuousTask();
    }
    AMapLocationManagerImpl.setApiKey(key);
    AMapLocationManagerImpl.updatePrivacyShow(AMapPrivacyShowStatus.DidShow, AMapPrivacyInfoStatus.DidContain, context);
    AMapLocationManagerImpl.updatePrivacyAgree(AMapPrivacyAgreeStatus.DidAgree, context);
    if (this.client == null) {
      this.client = new AMapLocationManagerImpl(context);

    }
    this.client?.setLocationListener(AMapLocationType.Single, this)
  }

  start(): Promise<string> {
    this.client?.setLocationListener(AMapLocationType.Updating, this)
    this.client?.setLocationOption(AMapLocationType.Updating, this.options)
    this.client?.startUpdatingLocation()
    return new Promise((resolve, reject) => {

      if (this.result != '') {
        resolve(this.result)
      } else {
        reject(this.errorMessage)
      }
    })
  }

  stop(): void {
    this.client?.stopUpdatingLocation()
  }


  getLastKnownLocation(): Promise<string> {
    this.client?.setLocationOption(AMapLocationType.Last, this.options);
    this.client?.setLocationListener(AMapLocationType.Last, this);
    this.client?.requestLastLocation();
    return new Promise((resolve, reject) => {
      if (this.result != '') {
        resolve(this.result)
      } else {
        reject(this.errorMessage)
      }
    });
  }

  setOnceLocation(): Promise<string> {
    this.client?.setLocationListener(AMapLocationType.Single, this)
    this.client?.setLocationOption(AMapLocationType.Single, this.options)
    this.client?.requestSingleLocation()
    return new Promise((resolve, reject) => {
      if (this.result != '') {
        resolve(this.result)
      } else {
        reject(this.errorMessage)
      }
    })
  }

  setInterval(interval: number): void {
    if (this.options != null) {
      this.options.timeInterval = interval;
    }
  }

  setGeoLanguage(language: number): void {
    if (this.options != null) {
      this.options.reGeocodeLanguage = language;
    }
  }

  setNeedAddress(value: boolean): void {
    if (this.options != null) {
      this.options.locatingWithReGeocode = value;
    }
  }

  setLocationTimeout(value: number): void {
    if (this.options != null) {
      this.options.singleLocationTimeout = value;
    }
  }

  setAllowsBackgroundLocationUpdates(isAllow: boolean): void {
    if (this.options != null) {
      this.options.allowsBackgroundLocationUpdates = isAllow;
    }
  }

  public setDistanceFilter(distance: number): void {
    if (this.options != null) {
      this.options.distanceInterval = distance;
    }
  }

  public setDesiredAccuracy(desiredAccuracy: number): void {
    if (this.options != null) {
      this.options.maxAccuracy = desiredAccuracy;
    }
  }

  private toJSON(location: AMapLocation): Map<string, ESObject> {
    if (location == null) {
      return new Map<string, ESObject>();
    }
    let map: Map<string, ESObject> = new Map<string, ESObject>();
    map.set("timestamp", location.timeStamp);
    map.set("accuracy", location.accuracy);
    map.set("latitude", location.latitude);
    map.set("longitude", location.longitude);
    map.set("altitude", location.altitude);
    map.set("speed", location.speed);
    map.set("direction", location.direction);
    map.set("timeSinceBoot", location.timeSinceBoot);
    map.set("additions", location.additions);
    map.set("additionSize", location.additionSize);
    map.set("isOffset", location.isOffset);
    map.set("reGeo", location.reGeo);
    if (location.reGeo != undefined) {
      map.set("address", location?.reGeo.address);
      map.set("description", location.reGeo.desc);
      map.set("poiName", location.reGeo.poiName);
      map.set("country", location.reGeo.country);
      map.set("province", location.reGeo.province);
      map.set("city", location.reGeo.city);
      map.set("cityCode", location.reGeo.citycode);
      map.set("district", location.reGeo.district);
      map.set("street", location.reGeo.street);
      map.set("adCode", location.reGeo.adcode);
    }
    return map;
  }
}