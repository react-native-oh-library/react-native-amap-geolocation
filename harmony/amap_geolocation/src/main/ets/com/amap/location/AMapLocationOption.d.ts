import geoLocationManager from '@ohos.geoLocationManager';
import { AMapLocationReGeocodeLanguage } from '../interface/AMapLocationCommonObj';

export interface AMapLocationOption {
  priority?: geoLocationManager.LocationRequestPriority;
  scenario?: geoLocationManager.LocationRequestScenario;
  timeInterval?: number;
  distanceInterval?: number;
  maxAccuracy?: number;
  isOffset?: boolean;
  allowsBackgroundLocationUpdates?: boolean;
  singleLocationTimeout?: number;
  locatingWithReGeocode?: boolean;
  reGeocodeLanguage?: AMapLocationReGeocodeLanguage;
}