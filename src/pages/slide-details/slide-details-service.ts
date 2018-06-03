import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';


declare var WLResourceRequest;
declare var navigator: any;
declare var WL;
/*
  Generated class for the SlideDetailsServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SlideDetailsServiceProvider {

  constructor(private utils: UtilsProvider, private strings: StringsProvider,private logger: LoggerServiceProvider) {
    
  }

  getBannerDetails(articleId:number){

		let promise = new Promise((resolve, reject) => {
      
            try {
      
          
      
              this.utils.showLoader();
              var data = { "params": "['" + articleId+ "','" + this.utils.getToekn()+ "']" };
              var resourceRequest = new WLResourceRequest("adapters/ContestNews/getBannerDetails", WLResourceRequest.GET);
              resourceRequest.setQueryParameter("params", "['" + articleId + "','" + this.utils.getToekn()+"']");
              resourceRequest.send().then((response) => {
                this.utils.hideLoader();
                resolve(response);
              },
                 (error)=> {
                  this.utils.hideLoader();
                  reject(error);
                  
                });
      
            }catch(e){
              reject(e);
              this.logger.log("Get Profile Adapter calling catch error:"+JSON.stringify(e));
            }	
      
          });
          return promise;	

  }

}
