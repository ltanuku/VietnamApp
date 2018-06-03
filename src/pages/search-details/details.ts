import { Injectable } from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';
import { StringsProvider } from '../../providers/strings/strings';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';

/*
  Generated class for the DetailsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var WLResourceRequest;

@Injectable()
export class DetailsProvider {
	adapterPath: any;
	constructor(public utils: UtilsProvider, public strings: StringsProvider,private logger: LoggerServiceProvider) {
		
	}
	
	/** search details service */
	getSearchDetails(policyNo, underwritingDetails) {
		if(underwritingDetails){
			this.adapterPath = "adapters/PendingUnderwritting/getPendingUnderWritingDetails";
		}else{
			this.adapterPath = "adapters/PendingIssued/getPendingIssuedDetails";
		}
		let promise = new Promise((resolve, reject) => {
			try {
					this.utils.showLoader();
					var resourceRequest = new WLResourceRequest(this.adapterPath, WLResourceRequest.POST);
					var data = { "params": "['" + policyNo + "','" + this.utils.getToekn() + "']" };
					resourceRequest.sendFormParameters(data).then((response) => {
						resolve(response);
					},
					function (error) {
						reject(error);
					});

				

			} catch (e) {
				this.utils.hideLoader();
				reject(e);
				this.logger.log("Search Details Adapter calling catch error:"+JSON.stringify(e));
			}
		});
		return promise;
	}

}
