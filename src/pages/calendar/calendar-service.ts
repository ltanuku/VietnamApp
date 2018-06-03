import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
declare var WLResourceRequest;
declare var WL;

/*
  Generated class for the CalendarServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CalendarServiceProvider {

  constructor(private utils: UtilsProvider, private strings: StringsProvider,private logger: LoggerServiceProvider) {
   

  }

  	/** Calendar Summary */
	getCalendarSummary(calendarPeriod) {
		let promise = new Promise((resolve, reject) => {
			try {
				if (this.utils.isDeviceOnLine()) {
					this.utils.showLoader();
					var data = { "params": "['" + this.utils.getUserID() + "','" + this.utils.getToekn() + "','" + calendarPeriod + "']" };
					var resourceRequest = new WLResourceRequest("adapters/Calendar/getCalendarSummary", WLResourceRequest.POST);
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
				this.logger.log("getCalendarSummary Adapter calling catch error:" + JSON.stringify(e));
			}
		});
		return promise;
	}

	/** Calendar Details */
	getCalendarDetails(calendarPeriod) {
		let promise = new Promise((resolve, reject) => {
			try {
				if (this.utils.isDeviceOnLine()) {
					// this.utils.showLoader();
					var resourceRequest = new WLResourceRequest("adapters/Calendar/getCalendarDetails", WLResourceRequest.POST);
					var data = { "params": "['" + this.utils.getUserID() + "','" + this.utils.getToekn() + "','" + calendarPeriod + "']" };
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
				this.logger.log("getCalendarDetails Adapter calling catch error:" + JSON.stringify(e));
			}
		});
		return promise;
	}



}
