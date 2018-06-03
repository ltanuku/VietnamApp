import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
declare var WLResourceRequest;
declare var WL;

/*
  Generated class for the PasscodeRegServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PasscodeRegServiceProvider {

  constructor(private utils: UtilsProvider, private strings: StringsProvider,private logger: LoggerServiceProvider) {
    
  }

	/** passcode Register **/

	passcodeRegister(Encypasscode, userID, deviceId) {
    
        let promise = new Promise((resolve, reject) => {
          try {
    
            if (this.utils.isDeviceOnLine()) {
              var resourceRequest = new WLResourceRequest("adapters/UserValidate/regPasscode", WLResourceRequest.GET);
              resourceRequest.setQueryParameter("params", "['" + Encypasscode + "','" + userID + "','" + deviceId + "']");
              resourceRequest.send().then((response) => {
                resolve(response);
              },
                function (error) {
                  reject(error);
                });
            } else {
              this.utils.showToastMsg(this.strings.noNetwork);
            }
          } catch (e) {
            reject(e);
            this.logger.log("passcodeRegister caiing catch error:" + JSON.stringify(e));
          }
        });
        return promise;
      }
    
    

      

}
