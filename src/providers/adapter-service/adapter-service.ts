import { Device } from '@ionic-native/device';
import { ConfigProvider } from './../config/config';
import { StringsProvider } from './../strings/strings';
import { Injectable } from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../logger-service/logger-service';
import { DatePipe } from '@angular/common';
import CryptoJS from 'crypto-js';
import {JsonStoreProvider} from '../json-store/json-store';
import {  AlertController, App, Platform ,Nav} from 'ionic-angular';
import {LoginPage} from '../../pages/login/login';
import {ViewChild } from '@angular/core';
/*
  Generated class for the AdapterServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var WLResourceRequest;
declare var navigator: any;
declare var WL;

@Injectable()
export class AdapterServiceProvider {
	@ViewChild(Nav) nav;
	public hasPopupOpen:boolean = false;

	constructor(private app: App,public utils: UtilsProvider,private platform:Platform, public strings: StringsProvider, private logger: LoggerServiceProvider, private date: DatePipe,
		private config: ConfigProvider, private device: Device,private jsonStore :JsonStoreProvider,public alertCtrl: AlertController,) {
	}

	/**hanling error response */

	handlingErrorResponse(ispopshow,data) {

		if(ispopshow){
			/** shwoing popup message */

			if (data.responseJSON.statusCode == 500) {
				this.showMessagePopup (true,data['responseJSON']['error_description'])

			} else if (data.responseJSON.statusCode == 400 || data.responseJSON.statusCode == 401) {
				this.showMessagePopup (true,data['responseJSON']['message'])

			} else {
				this.showMessagePopup (true,data['responseJSON']['message'])
			}

		}else{
			/** showing Toast Message  */

			if (data.responseJSON.statusCode == 500) {
				this.utils.showToastMsg(data['responseJSON']['error_description']);
			} else if (data.responseJSON.statusCode == 400 || data.responseJSON.statusCode == 401) {
				this.utils.showToastMsg(data['responseJSON']['message']);
			} else {
				this.utils.showToastMsg(data['responseJSON']['message']);
			}

		}


	}



	/** Analytics Log*/
	analytics(featureName) {
		if (this.utils.isDevice()) {
			try {
				/* Analytics Start */
				var timenow = this.date.transform(new Date(), "dd-MM-yyyy HH-mm-ss");
				var _monthYear = this.date.transform(new Date(), "MMM-yyyy");

				let event = {
					pagename: featureName,
					UserId: this.utils.getUserID(),
					DeviceID: this.utils.getDeviceId(),
					AppName: 'VietnamAgentApp',
					TimeStamp: timenow,
					OSVersion: this.device.platform + "-" + this.device.version,
					sessionId: this.config.userInfo.sessionId,
					MonthYear: _monthYear
				};

				WL.Analytics.log(event, featureName);
				WL.Analytics.send();

			} catch (e) {
				this.logger.log("Analyatics catch error:" + JSON.stringify(e));
			}
		}
	}

	encryptPassword(plainPassword: string): string {

		// Use Java Base64 encoded string of key in Angular / JS side. Using direct key will not work.
		let base64Key = this.config.base64Key;
		let encryptedData = "";
		try {
			// this is the actual key as a sequence of bytes
			let key = CryptoJS.enc.Base64.parse(base64Key);

			// this is Base64-encoded encrypted data
			encryptedData = CryptoJS.AES.encrypt(plainPassword, key, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});


		} catch (e){
			this.logger.log("Encrypt Password catch error : " + e);
		}

		return encryptedData.toString();
	}

	/** cleare user related stored data */
	clearUserCacheData (){

		/**clearing json store information */
		this.jsonStore.removeDataInJson(this.jsonStore.collectionNames.userDetails);
		this.jsonStore.removeDataInJson(this.jsonStore.collectionNames.imageDetails);

		/** reset the user  values userobject */
		this.config.userInfo.userID = null;
		this.config.userInfo.token = null;
		this.config.userInfo.agentCode = null;
		this.config.userInfo.userType = null;
		this.config.userInfo.agentsList = [];
		this.config.userInfo.sessionId = null;
		this.config.userInfo.userPasswd= null;

	}

	/**Popup Navigation with back navigation */

	showMessagePopup (isbackNavigation:boolean,message:string){
		this.hasPopupOpen = true;
		let alert = this.alertCtrl.create({
			//title: title,
			subTitle: message,
			enableBackdropDismiss:false,
			 buttons: [{
				  text: this.strings.popUpOk,

				  handler: () => {
					if(isbackNavigation)
						this.app.getRootNav().pop();
					this.hasPopupOpen = false;
				  }
				}]
		  });
		  alert.present();
		}

		/**confirm popup to logout and exit popup */
		confirmPopup(isExit:boolean, message:string ,callback){

			if(this.hasPopupOpen){

			return false;
			}
			this.hasPopupOpen = true;
			let confirmAlert = this.alertCtrl.create({
				//	title: 'Confirm purchase',
					message: message,
					enableBackdropDismiss:false,
					buttons: [
					  {
						text: this.strings.noBtn,

						handler: () => {
							 this.hasPopupOpen = false;
						}
					  },
					  {
						text: this.strings.yesBtn,
						handler: () => {
							/**exit the user  */
							if(isExit){
								this.platform.exitApp();

							}else{
								/**Clear the user stored data when click on logout button */
								if(callback)
								callback();
								this.clearUserCacheData();

								}

							this.hasPopupOpen = false;

						}
					  }
					]
				  });
	confirmAlert.present();


}



}
