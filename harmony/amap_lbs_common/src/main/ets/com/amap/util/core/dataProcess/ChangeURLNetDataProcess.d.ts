import HashMap from '@ohos.util.HashMap';
import { IRequest } from '../net/IRequest';
import { i46 } from './INetDataProcess';

export declare class s10 implements i46 {
  static n10?: HashMap<string, string>;
  isREST?: boolean;

  j10(request: IRequest): Promise<IRequest>;

  k10(request: IRequest): void;

  l10(k46: string, getParams: HashMap<string, string> | undefined): Promise<string>;

  o10(getParams: HashMap<string, string>): Promise<void>;

  p10(j46: HashMap<string, string> | undefined): string;
}