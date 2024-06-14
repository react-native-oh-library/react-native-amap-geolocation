/*
 * @Author: 17682309129 song_yu@hoperun.com
 * @Date: 2024-06-05 17:05:57
 * @LastEditors: 17682309129 song_yu@hoperun.com
 * @LastEditTime: 2024-06-11 15:41:59
 * @FilePath: \undefinedf:\ets\react\527\rn-project\daima\liangtao\geolocation\amap\src\NativeRNAMapGeolocation.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
    init(key: string): void;

	start(): Promise<string>;

	stop(): void;

	setInterval(interval: number): void;

	setNeedAddress(value: boolean): void;
	
	setLocationTimeout(value: number): void;

	setAllowsBackgroundLocationUpdates(isAllow: boolean): void;
	
	setDesiredAccuracy(desiredAccuracy: number): void;


	setGeoLanguage(language: number): void;

	setDistanceFilter(distance: number): void;

	setOnceLocation(): Promise<string>; 

	getLastKnownLocation(): Promise<string>;

}

export default TurboModuleRegistry.getEnforcing<Spec>("RNAMapGeolocation");