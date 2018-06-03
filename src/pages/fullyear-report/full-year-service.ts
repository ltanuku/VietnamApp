import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';

/*
  Generated class for the FullYearServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var WLResourceRequest;

@Injectable()
export class FullYearServiceProvider {

	constructor(private utils: UtilsProvider, public strings: StringsProvider, private logger: LoggerServiceProvider) {
	}
	
	/** Connecting to Full Year Personal Adapters */
	getFullYearPersonalData(agentID){
		let promise = new Promise((resolve, reject)=>{
			try{
				this.utils.showLoader();
				var resourceRequest = new WLResourceRequest("adapters/fullYearReport/getFullYearPersonal", WLResourceRequest.GET);
				resourceRequest.setQueryParameter("params", "['" + agentID + "','" + this.utils.getToekn() + "']");
				resourceRequest.send().then((response) => {
					resolve(response);
				},
				function (error) {
					reject(error);
				});			
			}catch(e){
				reject(e);
				this.logger.log("Full year Personal Adapter calling catch error:"+JSON.stringify(e));
			}		
		});
		return promise;
	}

	/** Connecting to Full Year Unit Adapters */
	getFullYearUnitData(agentID){
		let promise = new Promise((resolve, reject)=>{
			try{
				this.utils.showLoader();
				var resourceRequest = new WLResourceRequest("adapters/fullYearReport/getFullYearUnit", WLResourceRequest.GET);
				resourceRequest.setQueryParameter("params", "['" + agentID + "','" + this.utils.getToekn() + "']");
				resourceRequest.send().then((response) => {
					resolve(response);
				},
				function (error) {
					reject(error);
				});			
			}catch(e){
				reject(e);
				this.logger.log("Full year Unit Adapter calling catch error:"+JSON.stringify(e));
			}		
		});
		return promise;
	}

	/** Connecting to Full Year Branch Adapters */
	getFullYearBranchData(agentID){
		let promise = new Promise((resolve, reject)=>{
			try{
				this.utils.showLoader();
				var resourceRequest = new WLResourceRequest("adapters/fullYearReport/getFullYearBranch", WLResourceRequest.GET);
				resourceRequest.setQueryParameter("params", "['" + agentID + "','" + this.utils.getToekn() + "']");
				resourceRequest.send().then((response) => {
					resolve(response);
				},
				function (error) {
					reject(error);
				});			
			}catch(e){
				reject(e);
				this.logger.log("Full year Branch Adapter calling catch error:"+JSON.stringify(e));
			}		
		});
		return promise;
	}

}
