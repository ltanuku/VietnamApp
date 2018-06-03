import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
declare var WLResourceRequest;
declare var WL;
/*
  Generated class for the SlideListServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SlideListServiceProvider {

  constructor(private utils: UtilsProvider, private strings: StringsProvider,private logger: LoggerServiceProvider) {
  
  }


  getBannerListData(category,pageNum){


		let promise = new Promise((resolve, reject) => {
			try {

				
					this.utils.showLoader();
					var resourceRequest = new WLResourceRequest("adapters/ContestNews/getBannerList", WLResourceRequest.POST);
					var data = { "params": "['" + this.utils.getToekn() + "','" + pageNum + "', '" + category + "', '" + this.utils.pageSize + "']" };
					resourceRequest.sendFormParameters(data).then((response) => {
						resolve(response);
					},
						function (error) {
							reject(error);
						});
			

			} catch (e) {
				reject(e);
				this.logger.log("LoginAdapter caiing catch error:"+JSON.stringify(e));
			}
		});
		return promise;

  }

}
