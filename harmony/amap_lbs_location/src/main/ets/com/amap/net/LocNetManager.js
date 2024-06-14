import { LogUtil, NetManager } from '@amap/amap_lbs_common';
import HashMap from '@ohos.util.HashMap';
import util from '@ohos.util';
import { n12 } from './LocInfoParser';
import { AMapLocationReGeocodeLanguage } from '../interface/AMapLocationCommonObj';
import { AMapLocationManagerImpl } from '../location/AMapLocationManagerImpl';
import { Constants } from '../utils/Constants';
import http from '@ohos.net.http';

const y8 = "LocNetManager";

export class u8 {
    constructor(ctx, options) {
        this.y9 = new NetManager();
        this.locationOptions = options;
        this.context = ctx;
    }

    j6(m13, n13) {
        var o13;
        let header = {};
        header['Content-Type'] = "application/x-www-form-urlencoded";
        header['Connection'] = "Keep-Alive";
        header['User-Agent'] = Constants.p6;
        let params = new HashMap();
        params.set("custom", "26260A1F00020002");
        params.set("key", AMapLocationManagerImpl.k6);
        switch ((o13 = this.locationOptions) === null || o13 === void 0 ? void 0 : o13.reGeocodeLanguage) {
            case AMapLocationReGeocodeLanguage.Chinese:
                params.set("language", "zh-CN");
                break;
            case AMapLocationReGeocodeLanguage.English:
                params.set("language", "en");
                break;
            default:
                params.remove("language"); break;
        }
        params.set("curLocationType", "fineLoc");
        let p13 = `output=json&radius=1000&extensions=all&location=${n13},${m13}`;
        let q13 = new util.TextEncoder("utf-8");
        let r13 = q13.encodeInto(p13);
        let request = {
            header: header,
            url: "https://dualstack-arestapi.amap.com/v3/geocode/regeo",
            params: params,
            isREST: true,
            isPandoraBody: true,
            encryptedData: r13,
            needParseData: true
        };
        return this.y9.makeRequestPost(request, this.context).then((data) => {
            var w13, x13, y13, z13;
            let a14 = {
                status: (w13 = data.commonResponseResult) === null || w13 === void 0 ? void 0 : w13.status,
                info: (x13 = data.commonResponseResult) === null || x13 === void 0 ? void 0 : x13.info,
                infocode: (y13 = data.commonResponseResult) === null || y13 === void 0 ? void 0 : y13.infocode
            };
            if (data.responseCode === http.ResponseCode.OK && ((z13 = data.commonResponseResult) === null || z13 === void 0 ? void 0 : z13.status) === '1') {
                let b14 = new n12(this.locationOptions);
                if (data.result instanceof ArrayBuffer) {
                    a14.regeo = b14.b9(data.result);
                    return a14;
                } else if (typeof data.result === 'string') {
                    LogUtil.e(Constants.f6, y8, "regeo :" + data.result);
                    a14.regeo = b14.z8(data.result);
                    return a14;
                }
                return a14;
            } else {
                LogUtil.e(Constants.f6, y8, "逆地理请求失败:" + JSON.stringify(data.commonResponseResult));
                return a14;
            }
        });
    }
}