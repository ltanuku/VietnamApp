import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';

declare var WLResourceRequest;

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

				if (this.utils.isDeviceOnLine()) {
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
