import { Injectable } from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';
import { StringsProvider } from '../../providers/strings/strings';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';

/*
  Generated class for the UnderwritingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var WLResourceRequest;

@Injectable()
export class UnderwritingProvider {

	constructor(public utils: UtilsProvider, public strings: StringsProvider,private logger: LoggerServiceProvider) {
		
	}
	
	/** Policy underwriting status service */
	getUnderwriting(PageNum) {

		let promise = new Promise((resolve, reject) => {
			try {
				
					if(PageNum == 0)
						this.utils.showLoader();
					var resourceRequest = new WLResourceRequest("adapters/PendingUnderwritting/getPendingUnderWriting", WLResourceRequest.POST);
					var data = { "params": "['" + this.utils.getUserID() + "','" + this.utils.getToekn() + "','" + PageNum + "','" + this.utils.pageSize + "']" };
					resourceRequest.sendFormParameters(data).then((response) => {
						resolve(response);
					},
					function (error) {
						reject(error);
					});

			} catch (e) {
				this.utils.hideLoader();
				reject(e);
				this.logger.log("Underwriting Adapter calling catch error:"+JSON.stringify(e));
			}
		});
		return promise;
	}

}
