export class AMapLocationErrorCode {
}
AMapLocationErrorCode.ERROR_CHECK_PRIVACY = 1;
AMapLocationErrorCode.ERROR_CHECK_PERMINSSION = 2;
AMapLocationErrorCode.ERROR_SINGLE_LOCATION_FAIL = 3;
AMapLocationErrorCode.ERROR_LOCATION_SERVICE_CLOSE = 4;
AMapLocationErrorCode.ERROR_START_UPDATING_LOCATION_FAIL = 5;
AMapLocationErrorCode.ERROR_STOP_UPDATING_LOCATION_FAIL = 6;
AMapLocationErrorCode.ERROR_REQUEST_REGEO_FAIL = 7;
AMapLocationErrorCode.ERROR_LAST_LOCATION_FAIL = 8;

export var s5;
(function (y5) {
    y5[y5["Unknow"] = 0] = "Unknow";
    y5[y5["Inside"] = 1] = "Inside";
    y5[y5["Outside"] = 2] = "Outside";
})(s5 || (s5 = {}));

export var AMapLocationReGeocodeLanguage;
(function (x5) {
    x5[x5["Default"] = 0] = "Default";
    x5[x5["Chinese"] = 1] = "Chinese";
    x5[x5["English"] = 2] = "English";
})(AMapLocationReGeocodeLanguage || (AMapLocationReGeocodeLanguage = {}));

export var AMapLocationType;
(function (w5) {
    w5[w5["Last"] = 0] = "Last";
    w5[w5["Single"] = 1] = "Single";
    w5[w5["Updating"] = 2] = "Updating";
})(AMapLocationType || (AMapLocationType = {}));