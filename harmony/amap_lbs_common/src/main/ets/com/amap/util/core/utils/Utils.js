import util from '@ohos.util'; import HashMap from '@ohos.util.HashMap'; import { Constants } from './Constants'; import { LogUtil } from './LogUtil'; export class Utils { static f17(data) { return Utils.d37.encodeInto(data); } static uint8ArrayToString(data) { return Utils.decode.decodeWithStream(data); } static d35(p42) { let q42 = []; if (p42 === null) { return ""; } for (let r42 = 0; r42 < p42.length; r42++) { let s42 = (p42[r42] & 0xFF).toString(16); if (s42.length === 1) { s42 = '0' + s42; } q42.push(s42); } return q42.join(''); } static s11(str) { if (str === undefined) { return ''; } return str; } static r11(l42) { if (l42 === undefined) { return undefined; } try { let m42 = new HashMap(); let n42 = Object.getOwnPropertyNames(l42); n42.forEach((key) => { if (key && l42[key]) { let value = l42[key]; if (value) { m42.set(key, value); } } }); return m42; } catch (error) { LogUtil.e(Constants.z9, 'object2HashMap', 'object 转 HashMap 失败'); return undefined; } } } Utils.d37 = new util.TextEncoder("utf-8"); Utils.decode = util.TextDecoder.create("utf-8"); 