import geoLocationManager from '@ohos.geoLocationManager';
import { AMapLocationReGeo } from '../interface/AMapLocationReGeocode';

export interface AMapLocation extends geoLocationManager.Location {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  speed: number;
  timeStamp: number;
  direction: number;
  timeSinceBoot: number;
  additions?: string[];
  additionSize?: number;
  isOffset: boolean;
  reGeo?: AMapLocationReGeo;
}