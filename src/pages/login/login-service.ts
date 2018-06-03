import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
declare var WLResourceRequest;
declare var WL;
/*
  Generated class for the LoginServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginServiceProvider {

  constructor(private utils: UtilsProvider, private strings: StringsProvider,private logger: LoggerServiceProvider) {
    
  }

  	/** login **/
	userLogin(userID, passwd, deviceID, loginAvail) {
    
    
        let promise = new Promise((resolve, reject) => {
          try {
    
            if (this.utils.isDeviceOnLine()) {
              this.utils.showLoader();
              var resourceRequest = new WLResourceRequest("adapters/loginAdapter/login", WLResourceRequest.POST);
              var data = { "params": "['" + userID + "','" + passwd + "','" + deviceID + "', '" + loginAvail + "']" };
              resourceRequest.sendFormParameters(data).then((response) => {
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
            this.logger.log("LoginAdapter caiing catch error:" + JSON.stringify(e));
          }
        });
        return promise;
      }
}
