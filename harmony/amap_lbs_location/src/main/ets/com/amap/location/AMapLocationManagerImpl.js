import geoLocationManager from '@ohos.geoLocationManager';
import { LogUtil, privacyImpl, PermissionUtil, SDKInfo, authManager } from '@amap/amap_lbs_common';
import { u8 } from '../net/LocNetManager';
import { LocationOffsetUtils } from '@amap/amap_lbs_common';
import {
    AMapLocationErrorCode,
    AMapLocationReGeocodeLanguage,
    AMapLocationType
} from '../interface/AMapLocationCommonObj';
import { Constants } from '../utils/Constants';
import backgroundTaskManager from '@ohos.resourceschedule.backgroundTaskManager';
import wantAgent from '@ohos.app.ability.wantAgent';

const y8 = "AMapLocationManagerImpl";
const APPROXIMATELY_LOCATION = 'ohos.permission.APPROXIMATELY_LOCATION';
const LOCATION = 'ohos.permission.LOCATION';
const LOCATION_IN_BACKGROUND = 'ohos.permission.LOCATION_IN_BACKGROUND';

export class AMapLocationManagerImpl {
    constructor(ctx) {
        this.isStartLocation = false;
        this.locationCurrent = (err, location) => {
            if (err) {
                LogUtil.e(Constants.f6, y8, 'locationCurrent: err=' + JSON.stringify(err));
                this.notifyLocationError(AMapLocationErrorCode.ERROR_SINGLE_LOCATION_FAIL, JSON.stringify(err), this.singleLocationListener);
            }
            if (location) {
                LogUtil.e(Constants.f6, y8, 'locationCurrent: location=' + JSON.stringify(location));
                this.notifyLocation(location, this.singleLocationOption, this.singleLocationListener);
            }
        };
        this.locationChange = (location) => {
            LogUtil.e(Constants.f6, y8, 'locationChanger: location=' + JSON.stringify(location));
            this.notifyLocation(location, this.updatingLocationOption, this.updatingLocationListener);
        };
        if (!this.checkPrivacyStatus(ctx)) {
            LogUtil.e(Constants.f6, y8, 'Check PrivacyStatus Failed.');
            throw new Error('Check PrivacyStatus Failed.');
        }
        this.context = ctx;
        this.updatingLocationOption = {
            isOffset: true,
            allowsBackgroundLocationUpdates: false,
            locatingWithReGeocode: false,
            reGeocodeLanguage: AMapLocationReGeocodeLanguage.Chinese
        };
        this.singleLocationOption = {
            isOffset: true,
            allowsBackgroundLocationUpdates: false,
            locatingWithReGeocode: false,
            reGeocodeLanguage: AMapLocationReGeocodeLanguage.Chinese
        };
        this.lastLocationOption = {
            isOffset: true,
            allowsBackgroundLocationUpdates: false,
            locatingWithReGeocode: false,
            reGeocodeLanguage: AMapLocationReGeocodeLanguage.Chinese
        };
    }

    setLocationOption(v10, option) {
        if (v10 === AMapLocationType.Last) {
            this.realSetLocationOption(this.lastLocationOption, option);
        } else if (v10 === AMapLocationType.Single) {
            this.realSetLocationOption(this.singleLocationOption, option);
        } else if (v10 === AMapLocationType.Updating) {
            this.realSetLocationOption(this.updatingLocationOption, option);
        }
    }

    realSetLocationOption(u10, option) {
        if (option.priority === undefined) {
            u10.priority = geoLocationManager.LocationRequestPriority.UNSET;
        } else {
            u10.priority = option.priority;
        }
        if (option.scenario === undefined) {
            u10.scenario = geoLocationManager.LocationRequestScenario.UNSET;
        } else {
            u10.scenario = option.scenario;
        }
        if (option.timeInterval === undefined || option.timeInterval <= 0) {
            u10.timeInterval = 2;
        } else {
            u10.timeInterval = option.timeInterval;
        }
        if (option.distanceInterval === undefined || option.distanceInterval <= 0) {
            u10.distanceInterval = 0;
        } else {
            u10.distanceInterval = option.distanceInterval;
        }
        if (option.maxAccuracy === undefined || option.maxAccuracy <= 0) {
            u10.maxAccuracy = 0;
        } else {
            u10.maxAccuracy = option.maxAccuracy;
        }
        if (option.singleLocationTimeout === undefined || option.singleLocationTimeout < 1000) {
            u10.singleLocationTimeout = 1000;
        } else {
            u10.singleLocationTimeout = option.singleLocationTimeout;
        }
        if (option.isOffset === undefined) {
            u10.isOffset = true;
        } else {
            u10.isOffset = option.isOffset;
        }
        if (option.allowsBackgroundLocationUpdates === undefined) {
            u10.allowsBackgroundLocationUpdates = false;
        } else {
            u10.allowsBackgroundLocationUpdates = option.allowsBackgroundLocationUpdates;
        }
        if (option.locatingWithReGeocode === undefined) {
            u10.locatingWithReGeocode = false;
        } else {
            u10.locatingWithReGeocode = option.locatingWithReGeocode;
        }
        if (option.reGeocodeLanguage === undefined) {
            u10.reGeocodeLanguage = AMapLocationReGeocodeLanguage.Chinese;
        } else {
            u10.reGeocodeLanguage = option.reGeocodeLanguage;
        }
    }

    setLocationListener(t10, listener) {
        if (t10 === AMapLocationType.Last) {
            this.lastLocationListener = listener;
        } else if (t10 === AMapLocationType.Single) {
            this.singleLocationListener = listener;
        } else if (t10 === AMapLocationType.Updating) {
            this.updatingLocationListener = listener;
        }
    }

    checkPerminssion(p10) {
        var q10, r10, s10;
        if (!PermissionUtil.hasPerminssion(APPROXIMATELY_LOCATION)) {
            return false;
        }
        if (!PermissionUtil.hasPerminssion(LOCATION)) {
            return false;
        }
        if (p10 === AMapLocationType.Last) {
            if (((q10 = this.lastLocationOption) === null || q10 === void 0 ? void 0 : q10.allowsBackgroundLocationUpdates) && !PermissionUtil.hasPerminssion(LOCATION_IN_BACKGROUND)) {
                return false;
            }
        } else if (p10 === AMapLocationType.Single) {
            if (((r10 = this.singleLocationOption) === null || r10 === void 0 ? void 0 : r10.allowsBackgroundLocationUpdates) && !PermissionUtil.hasPerminssion(LOCATION_IN_BACKGROUND)) {
                return false;
            }
        } else if (p10 === AMapLocationType.Updating) {
            if (((s10 = this.updatingLocationOption) === null || s10 === void 0 ? void 0 : s10.allowsBackgroundLocationUpdates) && !PermissionUtil.hasPerminssion(LOCATION_IN_BACKGROUND)) {
                return false;
            }
        }
        return true;
    }

    requestLastLocation() {
        if (!this.checkPerminssion(AMapLocationType.Last)) {
            LogUtil.e(Constants.f6, y8, 'Check Perminssion Failed.');
            this.notifyLocationError(AMapLocationErrorCode.ERROR_CHECK_PERMINSSION, 'Check Perminssion Failed.', this.lastLocationListener);
            return;
        }
        let n10 = geoLocationManager.isLocationEnabled();
        if (!n10) {
            LogUtil.e(Constants.f6, y8, "定位服务未开启");
            this.notifyLocationError(AMapLocationErrorCode.ERROR_LOCATION_SERVICE_CLOSE, '定位服务未开启', this.lastLocationListener);
            return;
        }
        try {
            let o10 = geoLocationManager.getLastLocation();
            LogUtil.e(Constants.f6, y8, 'lastlocation: location=' + JSON.stringify(o10));
            this.notifyLocation(o10, this.lastLocationOption, this.lastLocationListener);
        } catch (e) {
            LogUtil.e(Constants.f6, y8, e);
            this.notifyLocationError(AMapLocationErrorCode.ERROR_LAST_LOCATION_FAIL, e, this.lastLocationListener);
        }
    }

    requestSingleLocation() {
        var h10, i10, j10, k10;
        if (!this.checkPerminssion(AMapLocationType.Single)) {
            LogUtil.e(Constants.f6, y8, 'Check Perminssion Failed.');
            this.notifyLocationError(AMapLocationErrorCode.ERROR_CHECK_PERMINSSION, 'Check Perminssion Failed.', this.singleLocationListener);
            return;
        }
        let l10 = geoLocationManager.isLocationEnabled();
        if (!l10) {
            LogUtil.e(Constants.f6, y8, "定位服务未开启");
            this.notifyLocationError(AMapLocationErrorCode.ERROR_LOCATION_SERVICE_CLOSE, '定位服务未开启', this.singleLocationListener);
            return;
        }
        let m10 = {
            priority: (h10 = this.singleLocationOption) === null || h10 === void 0 ? void 0 : h10.priority,
            scenario: (i10 = this.singleLocationOption) === null || i10 === void 0 ? void 0 : i10.scenario,
            maxAccuracy: (j10 = this.singleLocationOption) === null || j10 === void 0 ? void 0 : j10.maxAccuracy,
            timeoutMs: (k10 = this.singleLocationOption) === null || k10 === void 0 ? void 0 : k10.singleLocationTimeout
        };
        try {
            geoLocationManager.getCurrentLocation(m10, this.locationCurrent);
        } catch (e) {
            LogUtil.e(Constants.f6, y8, e);
            this.notifyLocationError(AMapLocationErrorCode.ERROR_SINGLE_LOCATION_FAIL, e, this.singleLocationListener);
        }
    }

    startUpdatingLocation() {
        var z9, a10, b10, c10, e10;
        if (this.isStartLocation) {
            return;
        }
        if (!this.checkPerminssion(AMapLocationType.Updating)) {
            LogUtil.e(Constants.f6, y8, 'Check Perminssion Failed.');
            this.notifyLocationError(AMapLocationErrorCode.ERROR_CHECK_PERMINSSION, 'Check Perminssion Failed.', this.updatingLocationListener);
            return;
        }
        let f10 = geoLocationManager.isLocationEnabled();
        if (!f10) {
            LogUtil.e(Constants.f6, y8, "定位服务未开启");
            this.notifyLocationError(AMapLocationErrorCode.ERROR_LOCATION_SERVICE_CLOSE, '定位服务未开启', this.updatingLocationListener);
            return;
        }
        let g10 = {
            priority: (z9 = this.updatingLocationOption) === null || z9 === void 0 ? void 0 : z9.priority,
            scenario: (a10 = this.updatingLocationOption) === null || a10 === void 0 ? void 0 : a10.scenario,
            maxAccuracy: (b10 = this.updatingLocationOption) === null || b10 === void 0 ? void 0 : b10.maxAccuracy,
            timeInterval: (c10 = this.updatingLocationOption) === null || c10 === void 0 ? void 0 : c10.timeInterval,
            distanceInterval: (e10 = this.updatingLocationOption) === null || e10 === void 0 ? void 0 : e10.distanceInterval,
        };
        try {
            geoLocationManager.on('locationChange', g10, this.locationChange);
            LogUtil.e(Constants.f6, y8, '========开始连续定位========');
            this.isStartLocation = true;
        } catch (e) {
            LogUtil.e(Constants.f6, y8, e);
            this.notifyLocationError(AMapLocationErrorCode.ERROR_START_UPDATING_LOCATION_FAIL, e, this.updatingLocationListener);
        }
    }

    stopUpdatingLocation() {
        if (!this.isStartLocation) {
            return;
        }
        if (!this.checkPerminssion(AMapLocationType.Updating)) {
            LogUtil.e(Constants.f6, y8, 'Check Perminssion Failed.');
            this.notifyLocationError(AMapLocationErrorCode.ERROR_CHECK_PERMINSSION, 'Check Perminssion Failed.', this.updatingLocationListener);
            return;
        }
        try {
            geoLocationManager.off('locationChange', this.locationChange);
            LogUtil.e(Constants.f6, y8, '========停止连续定位========');
            this.isStartLocation = false;
        } catch (e) {
            LogUtil.e(Constants.f6, y8, e);
            this.notifyLocationError(AMapLocationErrorCode.ERROR_STOP_UPDATING_LOCATION_FAIL, e, this.updatingLocationListener);
        }
    }

    startContinuousTask() {
        let ctx = this.context;
        let s9 = {
            wants: [{ bundleName: ctx.abilityInfo.bundleName, abilityName: ctx.abilityInfo.name }],
            operationType: wantAgent.OperationType.START_ABILITY,
            requestCode: 0,
            wantAgentFlags: [wantAgent.WantAgentFlags.UPDATE_PRESENT_FLAG],
        };
        wantAgent.getWantAgent(s9).then((u9) => {
            backgroundTaskManager.startBackgroundRunning(ctx, backgroundTaskManager.BackgroundMode.LOCATION, u9).then(() => {
                LogUtil.e(Constants.f6, y8, '========开启后台定位========');
            }).catch((err) => {
                LogUtil.e(Constants.f6, y8, `Failed to operation startBackgroundRunning. Code is ${err.code}, message is ${err.message}`);
            });
        });
    }

    stopContinuousTask() {
        let ctx = this.context;
        backgroundTaskManager.stopBackgroundRunning(ctx).then(() => {
            LogUtil.e(Constants.f6, y8, '========停止后台定位========');
        }).catch((err) => {
            LogUtil.e(Constants.f6, y8, `Failed to operation stopBackgroundRunning. Code is ${err.code}, message is ${err.message}`);
        });
    }

    notifyLocation(n9, option, listener) {
        if (listener != undefined) {
            let location = this.convert2AMapLocation(option, n9);
            if (!option.locatingWithReGeocode) {
                listener.onLocationChanged(location);
            } else {
                this.requestReGeoLocation(option, listener, location).then((p9) => {
                    if (listener != undefined) {
                        listener.onLocationChanged(p9);
                    }
                });
            }
        }
    }

    notifyLocationError(errorCode, errorMsg, listener) {
        if (listener != undefined) {
            let error = { errorCode: errorCode, errorMsg: errorMsg };
            listener.onLocationError(error);
        }
    }

    convert2AMapLocation(option, location) {
        let l9 = [location.longitude, location.latitude];
        if (option.isOffset) {
            l9 = LocationOffsetUtils.wgs84ToGcj02(location.longitude, location.latitude);
        }
        let m9 = {
            latitude: l9[1],
            longitude: l9[0],
            altitude: location.altitude,
            accuracy: location.accuracy,
            speed: location.speed,
            timeStamp: location.timeStamp,
            direction: location.direction,
            timeSinceBoot: location.timeSinceBoot,
            isOffset: option.isOffset !== undefined ? option.isOffset : true
        };
        return m9;
    }

    requestReGeoLocation(options, listener, location) {
        let h9 = new u8(this.context, options);
        return h9.j6(location.latitude, location.longitude).then((k9) => {
            if (k9.status === '1' && k9.regeo !== undefined) {
                location.reGeo = k9.regeo;
                return location;
            } else {
                this.notifyLocationError(AMapLocationErrorCode.ERROR_REQUEST_REGEO_FAIL, "请求逆地理异常:" + k9.infocode + " " + k9.info, listener);
                return location;
            }
        }).catch(() => {
            this.notifyLocationError(AMapLocationErrorCode.ERROR_REQUEST_REGEO_FAIL, "请求逆地理异常", listener);
            return location;
        });
    }

    static setApiKey(g9) {
        AMapLocationManagerImpl.k6 = g9;
        authManager.setApiKey(g9);
    }

    static updatePrivacyShow(d9, e9, context) {
        let f9 = new SDKInfo(Constants.l6, Constants.p6, Constants.s8, Constants.t8, []);
        privacyImpl.updatePrivacyShow(d9, e9, f9, context);
    }

    static updatePrivacyAgree(b9, context) {
        let c9 = new SDKInfo(Constants.l6, Constants.p6, Constants.s8, Constants.t8, []);
        privacyImpl.updatePrivacyAgree(b9, c9, context);
    }

    checkPrivacyStatus(context) {
        let a9 = new SDKInfo(Constants.l6, Constants.p6, Constants.s8, Constants.t8, []);
        return privacyImpl.checkPrivacyStatus(a9, context);
    }

    registerWithComponent(context) {
        let z8 = new SDKInfo(Constants.l6, Constants.p6, Constants.s8, Constants.t8, []);
        authManager.registerWithComponent(z8, context);
    }
}
AMapLocationManagerImpl.k6 = '';