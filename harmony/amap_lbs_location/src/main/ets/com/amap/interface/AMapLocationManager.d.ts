import { AMapLocation } from '../location/AMapLocation';
import { AMapLocationOption } from '../location/AMapLocationOption';
import { AMapLocationType } from './AMapLocationCommonObj';
import { e45 } from '../location/AMapLocationErrorInfo';

export interface AMapLocationManager {
  requestLastLocation(): void;

  requestSingleLocation(): void;

  startUpdatingLocation(): void;

  stopUpdatingLocation(): void;

  setLocationOption(locType: AMapLocationType, option: AMapLocationOption): void;

  setLocationListener(locType: AMapLocationType, listener: IAMapLocationListener): void;

  startContinuousTask(): void;

  stopContinuousTask(): void;
}

export interface IAMapLocationListener {
  onLocationChanged: (location: AMapLocation) => void;
  onLocationError: (locationErrorInfo: e45) => void;
}