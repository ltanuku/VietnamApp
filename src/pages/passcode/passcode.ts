import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Md5 } from 'ts-md5/dist/md5';
import { AdapterServiceProvider } from '../../providers/adapter-service/adapter-service';
import { ConfigProvider } from "../../providers/config/config";
import { JsonStoreProvider } from "../../providers/json-store/json-store";
import { LoginPage } from "../login/login";
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
import {PasscodeRegServiceProvider} from './passcode-reg-service';
/**
 * Generated class for the PasscodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-passcode',
  templateUrl: 'passcode.html',
})
export class PasscodePage {
	validatePassCode :any = [];
	regPasscode:any = [];
	constructor(public navCtrl: NavController, public menu: MenuController, public navParams: NavParams, public service: AdapterServiceProvider,private passcodeRegService: PasscodeRegServiceProvider
		,private config: ConfigProvider, private  jsonStore: JsonStoreProvider, public strings: StringsProvider,private utils:UtilsProvider,private logger: LoggerServiceProvider,public alertCtrl: AlertController) {
		service.analytics("Confirm Passcode");
		
		this.regPasscode = navParams.get("register");
	}
	
	/**passcode enter events function */
	passcode(event){
		if(this.validatePassCode.length < 4 && (event.srcEvent.srcElement.innerText[0] != undefined  && event.srcEvent.srcElement.innerText[0] != "" ))
			this.validatePassCode.push(event.srcEvent.srcElement.innerText[0]);
			/**if passcode length is 4 and doesn't match with previous passcode showing error message */
		if(this.validatePassCode.length == 4){
			if(!(this.validatePassCode.toString() == this.regPasscode.toString())){
				this.utils.showToastMsg(this.strings.passcodedoesntmatch);
				this.validatePassCode = [];
				return false;
			}

			/**  Passcode Register **/
			this.utils.showLoader();
			let userID = this.config.userInfo.userID;
			let deviceID = this.config.userInfo.deviceID;
			let Encypasscode = Md5.hashStr(this.config.userInfo.userID+""+this.validatePassCode);
		
			if(this.utils.isDeviceOnLine()){

			
				this.passcodeRegService.passcodeRegister(Encypasscode,userID,deviceID).then((res)=>{
					this.utils.hideLoader();
					try {
						let result =  res['responseJSON']['updateStatementResult'];
						if(result && result['updateCount'] > 0){
						//	this.config.userInfo.token = result['token'];
							
							/** update jsonstore **/
							this.jsonStore.addDataToJsonStore(this.jsonStore.collectionNames.userDetails, {
								id : this.config.userInfo.userID, 
								token :result['token'],
								agentCode : this.config.userInfo.agentCode,
								agentType : this.config.userInfo.userType
							});
							
							this.menu.enable(true);
							this.navCtrl.setRoot(HomePage);

						}
					}catch (e){
						this.logger.error("Passcode success catch error "+JSON.stringify(e));
					}
				},(err)=>{
					this.utils.showToastMsg(this.strings.serverError);
					this.utils.hideLoader();
					this.logger.error("Passcode failure error "+JSON.stringify(err));
				});

			}else{
				/** No network */
				this.validatePassCode  = [];
				this.utils.hideLoader();
				this.utils.showToastMsg(this.strings.noNetwork);
			}
		}
	}

	/**back to regpasscode */
	repeatPassBack(){
		this.navCtrl.pop();
	}
	
	/** delete passcode **/
	deletepasscode(){
	if(this.validatePassCode.length <= 4 && this.validatePassCode.length>0)
		this.validatePassCode.pop();
	}
}
