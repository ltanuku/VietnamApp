import { Injectable } from '@angular/core';

import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
import {AdapterServiceProvider} from '../../providers/adapter-service/adapter-service';
import { ConfigProvider } from "../../providers/config/config";
declare var WLResourceRequest;
/*
  Generated class for the ChangepasswdServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChangepasswdServiceProvider {

  constructor(private utils: UtilsProvider, private strings: StringsProvider,private logger: LoggerServiceProvider,public service: AdapterServiceProvider,public config: ConfigProvider) {
    
  }


  changePassword(newPassword){
       
        let promise = new Promise((resolve, reject) => {
          try {
               newPassword = this.service.encryptPassword(newPassword);

              this.utils.showLoader();
              var resourceRequest = new WLResourceRequest("adapters/Passwords/changePasswd", WLResourceRequest.POST);
              var data = { "params": "['" + this.utils.getUserID() + "','" + this.utils.getToekn()+ "', '" + this.config.userInfo.userPasswd + "', '" + newPassword + "']" };
              resourceRequest.sendFormParameters(data).then((response) => {
                resolve(response);
              },
                function (error) {
                  reject(error);
                });
          
    
          } catch (e) {
            reject(e);
            this.logger.log("changePassword caiing catch error:"+JSON.stringify(e));
          }
        });
        return promise;
    
      }

}
