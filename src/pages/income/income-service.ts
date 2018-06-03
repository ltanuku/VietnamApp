import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
import {AdapterServiceProvider} from '../../providers/adapter-service/adapter-service';
declare var WLResourceRequest;
declare var WL;

/*
  Generated class for the IncomeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IncomeServiceProvider {

  constructor(private utils: UtilsProvider, private strings: StringsProvider,private  service: AdapterServiceProvider,
    private logger: LoggerServiceProvider,) {
    
  }

  getIncomeData(pazeNum){
    
        let promise = new Promise((resolve, reject) => {
          try {
    
           
              if(pazeNum == 0)
              this.utils.showLoader();
              var resourceRequest = new WLResourceRequest("adapters/Income/getIncomeList", WLResourceRequest.POST);
              var data = { "params": "['" + this.utils.getUserID() +
              "','" + this.utils.getToekn() + 
              "', '" + pazeNum +
              "', '" + this.utils.pageSize + "']" };
              resourceRequest.sendFormParameters(data).then((response) => {
                resolve(response);
              },
                function (error) {
                  reject(error);
                });
    
            
    
          } catch (e) {
            reject(e);
            this.logger.log("Policy Search Adapter caiing catch error:"+JSON.stringify(e));
          }
        });
        return promise;
    
      }
    
/** */
getIncomeDataDetail(incomeID){
  
      let promise = new Promise((resolve, reject) => {
        try {
  
          if (this.utils.isDeviceOnLine()) {
            
            this.utils.showLoader();
            var resourceRequest = new WLResourceRequest("adapters/Income/getIncomeListDetails", WLResourceRequest.POST);
            var data = { "params": "['" + this.utils.getToekn() + 
            "', '" + incomeID + "']" };
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
          this.logger.log("Policy Search Adapter caiing catch error:"+JSON.stringify(e));
        }
      });
      return promise;
  
    }

}
