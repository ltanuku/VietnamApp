import { Injectable } from '@angular/core';
import { StringsProvider } from '../../../providers/strings/strings';
import { UtilsProvider } from '../../../providers/utils/utils';
import { LoggerServiceProvider } from '../../../providers/logger-service/logger-service';

declare var WLResourceRequest;
declare var WL;

/*
  Generated class for the PolicySearchServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PolicySearchServiceProvider {

  constructor(private utils: UtilsProvider, private strings: StringsProvider,
    private logger: LoggerServiceProvider) {
  
    
  }

  getPolicySearchData(formdata,pazeNum){

    let promise = new Promise((resolve, reject) => {
			try {

				if(formdata.spajNum == null)
				formdata.spajNum = "";

				if(formdata.policyNum == null)
				formdata.policyNum = "";

				if(formdata.holderName == null)
				formdata.holderName = "";

				if(formdata.agentCode == null)
				formdata.agentCode = "";

				if(formdata.agentName == null)
				formdata.agentName = "";

			
					if(pazeNum == 0)
					this.utils.showLoader();
					var resourceRequest = new WLResourceRequest("adapters/policySearch/getPolicySearchData", WLResourceRequest.POST);
					var data = { "params": "['" + this.utils.getUserID() +
					"','" + this.utils.getToekn() + 
					"','" + formdata.spajNum + 
					"','" + formdata.policyNum + 
					"','" + formdata.holderName + 
					"','" + formdata.agentCode + 
					"','" + formdata.agentName +
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


  }

