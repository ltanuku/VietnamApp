import { Injectable } from '@angular/core';


declare var WL;

@Injectable()
export class LoggerServiceProvider {
    isEnabled: boolean = true;
    constructor() {

    }

    log(msg: string) {
        if (this.isEnabled) {
            if(WL) WL.Logger.debug(msg);
        }
    }

    error(msg: string) {
        if (this.isEnabled) {
            if(WL) WL.Logger.error(msg);
        }
    }

    warn(msg: string) {
        if (this.isEnabled) {
            if(WL) WL.Logger.warn(msg);
        }
    }

}
