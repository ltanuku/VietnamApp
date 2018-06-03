import { Injectable } from '@angular/core';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';

/*
  Generated class for the SunEliteServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var WLResourceRequest;

@Injectable()
export class SunEliteServiceProvider {

	constructor(private utils: UtilsProvider, public strings: StringsProvider, private logger: LoggerServiceProvider) {
   
	}
	
	/** Connecting to SunElite Personal Adapter */
	getSunElitePersonalData(agentID){
		let promise = new Promise((resolve, reject)=>{
			try{
				this.utils.showLoader();
				var resourceRequest = new WLResourceRequest("adapters/SunElite/getSunElitePersonal", WLResourceRequest.GET);
				resourceRequest.setQueryParameter("params", "['" + agentID+ "','" + this.utils.getToekn() + "']");
				resourceRequest.send().then((response) => {
					resolve(response);
				},
				function (error) {
					reject(error);
				});			
			}catch(e){
				reject(e);
				this.logger.log("SunElite Personal Adapter calling catch error:"+JSON.stringify(e));
			}		
		});
		return promise;
	}
	
	/** Connecting to SunElite Unit Adapter */
	getSunEliteUnitData(agentID){
		let promise = new Promise((resolve, reject)=>{
			try{
				if (this.utils.isDeviceOnLine()) {
					this.utils.showLoader();
					var resourceRequest = new WLResourceRequest("adapters/SunElite/getSunEliteUnit", WLResourceRequest.GET);
					resourceRequest.setQueryParameter("params", "['" + agentID + "','" + this.utils.getToekn() + "']");
					resourceRequest.send().then((response) => {
						resolve(response);
					},
					function (error) {
						reject(error);
					});
				}else{
					this.utils.showToastMsg(this.strings.noNetwork);
				}			
			}catch(e){
				reject(e);
				this.logger.log("SunElite Unit Adapter calling catch error:"+JSON.stringify(e));
			}		
		});
		return promise;
	}
	
	/** Connecting to SunElite Branch Adapter */
	getSunEliteBranchData(agentID){
		let promise = new Promise((resolve, reject)=>{
			try{
				if (this.utils.isDeviceOnLine()) {
					this.utils.showLoader();
					var resourceRequest = new WLResourceRequest("adapters/SunElite/getSunEliteBranch", WLResourceRequest.GET);
					resourceRequest.setQueryParameter("params", "['" + agentID + "','" + this.utils.getToekn() + "']");
					resourceRequest.send().then((response) => {
						resolve(response);
					},
					function (error) {
						reject(error);
					});
				}else{
					this.utils.showToastMsg(this.strings.noNetwork);
				}			
			}catch(e){
				reject(e);
				this.logger.log("SunElite Branch Adapter calling catch error:"+JSON.stringify(e));
			}		
		});
		return promise;
	}

}
