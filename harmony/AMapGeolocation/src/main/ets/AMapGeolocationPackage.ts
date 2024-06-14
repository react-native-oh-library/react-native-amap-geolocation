import { RNPackage, TurboModulesFactory } from '@rnoh/react-native-openharmony/ts';
import type { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { AMapGeolocationModule } from './AMapGeolocationModule';
import { TM } from "@rnoh/react-native-openharmony/generated/ts";

class AMapGeolocationModulesFactory extends TurboModulesFactory {
  createTurboModule(name: string): TurboModule | null {
    if (name === TM.RNAMapGeolocation.NAME) {
      return new AMapGeolocationModule(this.ctx)
    }
    return null;
  }

  hasTurboModule(name: string): boolean {
    return name === TM.RNAMapGeolocation.NAME;
  }
}

export class AMapGeolocationPackage extends RNPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new AMapGeolocationModulesFactory(ctx);
  }
}