import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';

/*
  Generated class for the MdrtServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var WLResourceRequest;

@Injectable()
export class MdrtServiceProvider {

	constructor(private utils: UtilsProvider, public strings: StringsProvider, private logger: LoggerServiceProvider) {
	}
	
	/** Connecting to MDRT Adapters */
	getMdrtData(agentID){
		let promise = new Promise((resolve, reject)=>{
			try{
				this.utils.showLoader();
				var resourceRequest = new WLResourceRequest("adapters/MDRT/getMdrt", WLResourceRequest.GET);
				resourceRequest.setQueryParameter("params", "['"+ agentID + "','" + this.utils.getToekn() + "']");
				resourceRequest.send().then((response) => {
					resolve(response);
				},
				function (error) {
					reject(error);
				});		
			}catch(e){
				reject(e);
				this.logger.log("MDRT Adapter calling catch error:"+JSON.stringify(e));
			}		
		});
		return promise;
	}

}
