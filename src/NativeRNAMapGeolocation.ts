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
 
import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import { TurboModuleRegistry } from "react-native";

enum GeoLanguage {
	/**
	 * 默认，根据位置按照相应的语言返回逆地理信息，在国外按英语返回，在国内按中文返回
	 */
	DEFAULT = "DEFAULT",

	/**
	 * 中文，无论在国外还是国内都为返回中文的逆地理信息
	 */
	ZH = "ZH",

	/**
	 * 英文，无论在国外还是国内都为返回英文的逆地理信息
	 */
	EN = "EN"
}


export interface Spec extends TurboModule {
	init(key: string): Promise<void>;

	start(): void;

	stop(): void;

	setInterval(interval: number): void;

	setNeedAddress(value: boolean): void;

	setLocationTimeout(value: number): void;

	setAllowsBackgroundLocationUpdates(isAllow: boolean): void;

	setDesiredAccuracy(desiredAccuracy: number): void;

	setGeoLanguage(language: GeoLanguage): void;

	setDistanceFilter(distance: number): void;

	setOnceLocation(onceLocation: boolean): void;

}

export default TurboModuleRegistry.getEnforcing<Spec>("RNAMapGeolocation");