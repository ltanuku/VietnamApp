import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';

declare var WLResourceRequest;

/*
  Generated class for the IndividulPerformanceServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IndividulPerformanceServiceProvider {

	constructor(private utils: UtilsProvider, private strings: StringsProvider,private logger: LoggerServiceProvider) {    
    
	}
	
	/** Get Individual Performance data from Adapters */
	getIndividulPerformance(agentid){   
		let promise = new Promise((resolve, reject) => {     
			try {             
				this.utils.showLoader();                
				var resourceRequest = new WLResourceRequest("adapters/ProductionReport/getPersonalProdction", WLResourceRequest.GET);
				resourceRequest.setQueryParameter("params", "['" + agentid + "','" + this.utils.getToekn()+"']");
				resourceRequest.send().then((response) => {
					this.utils.hideLoader();
					resolve(response);
				},
				(error)=> {
					this.utils.hideLoader();
					reject(error);                    
				});          
        
			}catch(e){
				this.utils.hideLoader();
                reject(e);
                this.logger.log("Personal Production Adapter calling catch error:"+JSON.stringify(e));
            }	
        
        });
        return promise;	
    
    }    

}
