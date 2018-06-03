import { Injectable } from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';
import { StringsProvider } from '../../providers/strings/strings';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';

/*
  Generated class for the PolicyListProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var WLResourceRequest;

@Injectable()
export class PolicyListProvider {

	constructor(public utils: UtilsProvider, public strings: StringsProvider,private logger: LoggerServiceProvider) {
	}
  
	/** Waiting For Ack Service */
	getPolicyList(PageNum, pathKey) {

		let promise = new Promise((resolve, reject) => {
			try {

				
					if(PageNum == 0)
						this.utils.showLoader();
					var resourceRequest = new WLResourceRequest("adapters/waitingForAck/getWaitForAck", WLResourceRequest.POST);
					var data = { "params": "['" + this.utils.getUserID() + "','" + this.utils.getToekn() + "','" + PageNum + "','" + this.utils.pageSize + "','" + pathKey + "']" };
					resourceRequest.sendFormParameters(data).then((response) => {
						resolve(response);
					},
					function (error) {
						reject(error);
					});

				
			} catch (e) {
				this.utils.hideLoader();
				reject(e);
				this.logger.log("waitingForAck Adapter calling catch error:"+JSON.stringify(e));
			}
		});
		return promise;
	}

}
