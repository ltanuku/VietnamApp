import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
declare var WLResourceRequest;
declare var WL;

/*
  Generated class for the PasscodeLoginServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PasscodeLoginServiceProvider {

  constructor(private utils: UtilsProvider, private strings: StringsProvider,private logger: LoggerServiceProvider) {

  }
	/** passcode login verification **/

	passcodeLoginValidation(userID, deviceID, Encypasscode, token) {

        let promise = new Promise((resolve, reject) => {
          try {

            /** checking network connection **/
            if (this.utils.isDeviceOnLine()) {
              this.utils.showLoader();
              var resourceRequest = new WLResourceRequest("adapters/UserValidate/checkLoginDetails", WLResourceRequest.GET);
              resourceRequest.setQueryParameter("params", "['" + userID + "','" + deviceID + "','" + Encypasscode + "','" + token + "']");
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
            this.logger.log("passcodeLoginValidation caiing catch error:" + JSON.stringify(e));
          }
        });
        return promise;
      }

      touchIDLoginValidation(userID, deviceID, token) {

            let promise = new Promise((resolve, reject) => {
              try {

                /** checking network connection **/
                if (this.utils.isDeviceOnLine()) {
                  this.utils.showLoader();
                  var resourceRequest = new WLResourceRequest("adapters/UserValidate/getLoginDetailsForTouchIdAuth", WLResourceRequest.GET);
                  resourceRequest.setQueryParameter("params", "['" + userID + "','" + deviceID + "','" + token + "']");
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
                this.logger.log("passcodeLoginValidation caiing catch error:" + JSON.stringify(e));
              }
            });
            return promise;
          }

}
