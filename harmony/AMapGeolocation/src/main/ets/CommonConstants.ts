/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Permissions } from '@ohos.abilityAccessCtrl';

/**
 * Common constants for all features.
 */
export class CommonConstants {
	/**
	 * The request permission.
	 */
	static readonly REQUEST_PERMISSIONS: Array<Permissions> = [
		'ohos.permission.APPROXIMATELY_LOCATION',
		'ohos.permission.LOCATION',
	];

	/**
	 * The initialization value.
	 */
	static readonly INITIALIZATION_VALUE: string = '0';
}