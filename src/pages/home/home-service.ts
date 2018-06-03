import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
declare var WLResourceRequest;
declare var WL;
/*

/*
  Generated class for the HomeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HomeServiceProvider {

  constructor(private utils: UtilsProvider, private strings: StringsProvider,private logger: LoggerServiceProvider) {
    
  }

/** Home Page Details */
getHomePage(width, height, lastBannerUpdate, lastUserUpdate,isFromRefresh:boolean) {
  let promise = new Promise((resolve, reject) => {
    try {

      if (this.utils.isDeviceOnLine()) {
        if(!isFromRefresh)
        ///this.utils.showLoader();
        var data = {
          "params": "['" + this.utils.getUserID() + "','" + this.utils.getToekn() + "','" + width +
          "','" + height + "','" + lastBannerUpdate + "','" + lastUserUpdate + "']"
        };
        var resourceRequest = new WLResourceRequest("adapters/LandingPage/getLandingPage", WLResourceRequest.POST);

        resourceRequest.sendFormParameters(data).then((response) => {
          
          resolve(response);
        },
          (error) => {
          
            reject(error);

          });

      } else {
        this.utils.showToastMsg(this.strings.noNetwork);
      }
    } catch (e) {
      reject(e);
      this.logger.log("getHomePage Adapter calling catch error:" + JSON.stringify(e));
    }
  });
  return promise;

}
  /**Agents list  */
getAgentsDropDownList(userType){

  let promise = new Promise((resolve, reject) => {
    
    try {
    
          if(this.utils.isDeviceOnLine()){
    
            this.utils.showLoader();
            
            var resourceRequest = new WLResourceRequest("adapters/AgentTree/getAgentsList", WLResourceRequest.GET);
            resourceRequest.setQueryParameter("params", "['" + this.utils.getUserID() + "','" + this.utils.getToekn()+"','" +userType+"']");
            resourceRequest.send().then((response) => {
              resolve(response);
            },
               (error)=> {
                reject(error);
                
              });
    
    
          }else {
            this.utils.showToastMsg(this.strings.noNetwork);
          }
    
    
      }catch(e){
            reject(e);
            this.logger.log("Agent Tree Adapter calling catch error:"+JSON.stringify(e));
          }	
    
       });
        return promise;	

  }

}



