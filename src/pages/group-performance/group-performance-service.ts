import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';

declare var WLResourceRequest;

/*
  Generated class for the GroupPerformanceServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroupPerformanceServiceProvider {

	constructor(private utils: UtilsProvider, private strings: StringsProvider,private logger: LoggerServiceProvider) {
   
	}
	
	/** Get Team Performance data from Adapters */
	getTeamPerformance(agentID,agentLevel){   
		let promise = new Promise((resolve, reject) => {     
			try {          
				this.utils.showLoader();                
				var resourceRequest = new WLResourceRequest("adapters/ProductionReport/teamProdctionReport", WLResourceRequest.GET);
				resourceRequest.setQueryParameter("params", "['" + agentID + "','" + this.utils.getToekn()+"','" + agentLevel+"']");
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
