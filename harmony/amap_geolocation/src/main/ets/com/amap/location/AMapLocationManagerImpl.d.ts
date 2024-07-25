import geoLocationManager from '@ohos.geoLocationManager';
import { IAMapLocationListener, AMapLocationManager } from '../interface/AMapLocationManager';
import { AMapLocationOption } from './AMapLocationOption';
import { AMapPrivacyShowStatus, AMapPrivacyInfoStatus, AMapPrivacyAgreeStatus } from '../../../../../../IndexMap';
import { AMapLocationType } from '../interface/AMapLocationCommonObj';
import { Context } from '@kit.AbilityKit';

export declare class AMapLocationManagerImpl implements AMapLocationManager {
  static k6: string;
  private updatingLocationListener?;
  private singleLocationListener?;
  private lastLocationListener?;
  private updatingLocationOption;
  private singleLocationOption;
  private lastLocationOption;
  private context;
  private isStartLocation;

  constructor(ctx: Context);

  setLocationOption(k45: AMapLocationType, option: AMapLocationOption): void;

  private realSetLocationOption;

  setLocationListener(j45: AMapLocationType, listener: IAMapLocationListener): void;

  private checkPerminssion;

  requestLastLocation(): void;

  locationCurrent: (err: Error, location: geoLocationManager.Location) => void;

  requestSingleLocation(): void;

  locationChange: (location: geoLocationManager.Location) => void;

  startUpdatingLocation(): void;

  stopUpdatingLocation(): void;

  startContinuousTask(): void;

  stopContinuousTask(): void;

  private notifyLocation;
  private notifyLocationError;
  private convert2AMapLocation;
  private requestReGeoLocation;

  static setApiKey(i45: string): void;

  static updatePrivacyShow(g45: AMapPrivacyShowStatus, h45: AMapPrivacyInfoStatus, context: Context): void;

  static updatePrivacyAgree(f45: AMapPrivacyAgreeStatus, context: Context): void;

  private checkPrivacyStatus;
  private registerWithComponent;
}