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

import { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts';
import {
  AMapLocation,
  AMapLocationManagerImpl,
  AMapLocationOption,
  AMapLocationReGeocodeLanguage,
  AMapLocationType,
  AMapPrivacyAgreeStatus,
  AMapPrivacyInfoStatus,
  AMapPrivacyShowStatus,
  e45,
  IAMapLocationListener
} from '../../../IndexMap';

import abilityAccessCtrl, { PermissionRequestResult, Permissions } from '@ohos.abilityAccessCtrl';
import common from '@ohos.app.ability.common';

import { CommonConstants } from './CommonConstants';
import geoLocationManager from '@ohos.geoLocationManager';
import bundleManager from '@ohos.bundle.bundleManager';

export class AMapGeolocationModule extends TurboModule implements IAMapLocationListener, TM.RNAMapGeolocation.Spec {
  private options: AMapLocationOption | null = null;
  private client: AMapLocationManagerImpl | null = null;
  private isSingle: boolean = false;

  constructor(ctx: TurboModuleContext) {
    super(ctx);
    this.options = {
      priority: geoLocationManager.LocationRequestPriority.FIRST_FIX,
      scenario: geoLocationManager.LocationRequestScenario.UNSET,
      maxAccuracy: 0,
      timeInterval: 2,
      singleLocationTimeout: 10000,
      allowsBackgroundLocationUpdates: false,
      locatingWithReGeocode: true,
      distanceInterval: 0,
      reGeocodeLanguage: AMapLocationReGeocodeLanguage.Chinese,
      isOffset: true
    }
  }
  onLocationChanged(location: AMapLocation): void {
    this.ctx.rnInstance.emitDeviceEvent(
      "AMapGeolocation",
      {
        timestamp: location.timeStamp,
        accuracy: location.accuracy,
        latitude: location.latitude,
        longitude: location.longitude,
        altitude: location.altitude,
        speed: location.speed,
        direction: location.direction,
        timeSinceBoot: location.timeSinceBoot,
        additions: location.additions,
        additionSize: location.additionSize,
        isOffset: location.isOffset,
        reGeo: location.reGeo,
        address: location.reGeo?.address,
        description: location.reGeo?.desc,
        poiName: location.reGeo?.poiName,
        country: location.reGeo?.country,
        province: location.reGeo?.province,
        city: location.reGeo?.city,
        cityCode: location.reGeo?.citycode,
        district: location.reGeo?.district,
        street: location.reGeo?.street,
        adCode: location.reGeo?.adcode
      }
    )
  };

  onLocationError(locationErrorInfo: e45): void {
  };

  requestPermissions(): void {
    let atManager = abilityAccessCtrl.createAtManager();
    try {
      atManager.requestPermissionsFromUser(this.ctx.uiAbilityContext, CommonConstants.REQUEST_PERMISSIONS)
        .then((data) => {
          if (data.authResults[0] !== 0 || data.authResults[1] !== 0) {
            return;
          }
        })
    } catch (err) {
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
    }

    // 校验应用是否被授予权限
    try {
      grantStatus = await atManager.checkAccessToken(tokenId, permission);
    } catch (error) {
    }

    return grantStatus;
  }

  async checkPermissions(): Promise<void> {
    const permissions: Array<Permissions> = ['ohos.permission.LOCATION'];
    let grantStatus: abilityAccessCtrl.GrantStatus = await this.checkAccessToken(permissions[0]);

    if (grantStatus === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED) {
      // 已经授权，可以继续访问目标操作
    } else {
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
          return;
        }
      }
    })
  }

  init(key: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let context: common.UIAbilityContext = this.ctx.uiAbilityContext;
        this.checkPermissions();
        if (this.client != null) {
          this.client.stopContinuousTask();
        }
        AMapLocationManagerImpl.setApiKey(key);
        AMapLocationManagerImpl.updatePrivacyShow(AMapPrivacyShowStatus.DidShow, AMapPrivacyInfoStatus.DidContain,
          context);
        AMapLocationManagerImpl.updatePrivacyAgree(AMapPrivacyAgreeStatus.DidAgree, context);

        if (this.client == null) {
          this.client = new AMapLocationManagerImpl(context);
        }
        this.client?.setLocationListener(AMapLocationType.Single, this)
        resolve();
      } catch (exception) {
        reject(exception)
      }
    })
  }

  start(): void {
    if (this.isSingle) {
      this.client?.setLocationListener(AMapLocationType.Single, this)
      this.client?.setLocationOption(AMapLocationType.Single, this.options)
      this.client?.requestSingleLocation()
    } else {
      this.client?.setLocationListener(AMapLocationType.Updating, this)
      this.client?.setLocationOption(AMapLocationType.Updating, this.options)
      this.client?.startUpdatingLocation()
    }
  }

  stop(): void {
    this.client?.stopUpdatingLocation()
  }

  setOnceLocation(onceLocation: boolean): void {
    if (onceLocation) {
      this.isSingle = true;
    } else {
      this.isSingle = false;
    }
  }

  setInterval(interval: number): void {
    if (this.options != null) {
      this.options.timeInterval = interval / 1000;
    }
  }

  setGeoLanguage(language: TM.RNAMapGeolocation.GeoLanguage): void {
    let realLanguage;
    if (this.options != null) {
      if (language == TM.RNAMapGeolocation.GeoLanguage.ZH) {
        realLanguage = AMapLocationReGeocodeLanguage.Chinese;
      } else if (language == TM.RNAMapGeolocation.GeoLanguage.EN) {
        realLanguage = AMapLocationReGeocodeLanguage.English;
      } else {
        realLanguage = AMapLocationReGeocodeLanguage.Default;
      }
      this.options.reGeocodeLanguage = realLanguage;
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

  setOffsetValue(isOffset:boolean){
    if (this.options != null) {
      this.options.isOffset = isOffset;
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
}

