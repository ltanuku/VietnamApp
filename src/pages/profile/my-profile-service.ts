import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
declare var WLResourceRequest;

/*
  Generated class for the MyProfileServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MyProfileServiceProvider {

  constructor(private utils: UtilsProvider, private strings: StringsProvider,private logger: LoggerServiceProvider) {
    
  }
	/** Get Profile */
	getProfile() {
    
        let promise = new Promise((resolve, reject) => {
    
          try {
    
            if (this.utils.isDeviceOnLine()) {
    
              this.utils.showLoader();
    
              var resourceRequest = new WLResourceRequest("adapters/Profile/getProfile", WLResourceRequest.GET);
              resourceRequest.setQueryParameter("params", "['" + this.utils.getUserID() + "','" + this.utils.getToekn() + "']");
              resourceRequest.send().then((response) => {
                resolve(response);
              },
                (error) => {
                  this.utils.hideLoader();
                  reject(error);
    
                });
    
    
            } else {
              this.utils.showToastMsg(this.strings.noNetwork);
            }
    
    
          } catch (e) {
            reject(e);
            this.logger.log("Get Profile Adapter calling catch error:" + JSON.stringify(e));
          }
    
        });
        return promise;
    
      }
}
