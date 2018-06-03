import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController} from 'ionic-angular';
import { ConfigProvider } from "../../providers/config/config";
import { Md5 } from 'ts-md5/dist/md5';
import { AdapterServiceProvider } from "../../providers/adapter-service/adapter-service";
import { HomePage } from "../home/home";
import { LoginPage } from "../login/login";
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { JsonStoreProvider } from "../../providers/json-store/json-store";
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
import {PasscodeLoginServiceProvider} from './passcode-login-service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

/**
 * Generated class for the PasscodeLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-passcode-login',
  templateUrl: 'passcode-login.html',
})
export class PasscodeLoginPage {
	loginPassCode :any = [];
	constructor(private menu:MenuController, private navCtrl: NavController, public navParams: NavParams, private config: ConfigProvider, private service: AdapterServiceProvider,
		private utils:UtilsProvider, private jsonStore :JsonStoreProvider, private strings: StringsProvider,
		private logger:LoggerServiceProvider,private passcodeLoginService: PasscodeLoginServiceProvider,
		private touchId: FingerprintAIO) {

		service.analytics("Passcode");

	}

	ionViewDidEnter(){
		console.log("did enter " );
		this.touchId.isAvailable().then(
			res => {
			  this.touchId.show({
				  clientId: this.config.clientId,
				  clientSecret: this.config.clientSecret, //Only necessary for Android
				  disableBackup:true,  //Only for Android(optional)
  
			  })
			  .then((result: any) =>{
				  /* touch id success */
		  		this.touchIDValidate();
  
			  })
			  .catch((error: any) => {
				  this.logger.error("catch error touch id " + error);
			  });
  
			},
			err => {this.logger.error('TouchID is not available ' + err)}
		  );
	}


	/** delete login passcode **/
	deleteLoginpasscode(){
		this.loginPassCode.pop();
	}

	/** login passcode **/
	passcodeLogin(event){
		if(this.loginPassCode.length < 4 && (event.srcEvent.srcElement.innerText[0] != undefined  && event.srcEvent.srcElement.innerText[0] != "" ) )
			this.loginPassCode.push(event.srcEvent.srcElement.innerText[0]);

		if(this.loginPassCode.length == 4){

			/** validating login passcode **/
			let userID = this.config.userInfo.userID;
			let deviceID = this.config.userInfo.deviceID;
			let Encypasscode = Md5.hashStr(this.config.userInfo.userID+""+this.loginPassCode);
			let token = this.config.userInfo.token;
			
			if(this.utils.isDeviceOnLine()){		
				this.passcodeLoginService.passcodeLoginValidation(userID,deviceID,Encypasscode,token).then((res)=>{
					this.utils.hideLoader();
					try {
						if(res['responseJSON'] && res['status'] == 200){
							let result = res['responseJSON'];
							if( result && result['valid']){
								this.menu.enable(true);
								this.navCtrl.setRoot(HomePage);
								this.config.userInfo.token = result['token_type']+" "+result['access_token'];

							/* Invalid pass-code for 3 times, show error of maximum attempts and navigate to login screen */
							}else if(!result.valid_token || result.valid_count >= 3){
							/**remove data from jsonStore */
					
								if(result['valid_count'] >= 3)
									this.utils.showToastMsg(this.strings.passcodeblocked);
								else if(result['auth_token'] != null && result['auth_token'] == false)
									this.utils.showToastMsg(this.strings.authenticationFail);
								else if(!result['valid_token'])
									this.utils.showToastMsg(this.strings.passcodeIsExpired);
						
									this.goToLoginPage();
							}else if(!result['valid_passcode']){
								/** invalid passcode */
								this.loginPassCode = [];
								this.utils.showToastMsg(this.strings.wrongpasscode);
									/** TODO: need to implement device vobrate */
							}else if(!result.valid_password){
								this.utils.showToastMsg(this.strings.PasscodeValidationFail);
								this.goToLoginPage();
							}
						}else{
							/**false: Toast message and handling error */
							this.service.handlingErrorResponse(false,res);
						}
					}catch(err){
						this.logger.error("passcode login catch error "+JSON.stringify(err));
					}
				},(err)=>{
					this.utils.hideLoader();
					this.loginPassCode = [];
					this.utils.showToastMsg(this.strings.serverError);
					this.logger.error("passcode login failure error "+JSON.stringify(err));
				});

			}else{
				this.loginPassCode = [];
				this.utils.showToastMsg(this.strings.noNetwork);
			}
		}
	}

	/**Navigate to login */
	goToLoginPage(){
		this.service.clearUserCacheData();
		this.navCtrl.setRoot(LoginPage);
	}

	touchIDValidate(){

		let userID = this.config.userInfo.userID;
		let deviceID = this.config.userInfo.deviceID;
		let Encypasscode = Md5.hashStr(this.config.userInfo.userID+""+this.loginPassCode);
		let token = this.config.userInfo.token;


		if(this.utils.isDeviceOnLine()){		
			this.passcodeLoginService.touchIDLoginValidation(userID,deviceID,token).then((res)=>{
				this.utils.hideLoader();
					try {
						if(res['responseJSON'] && res['status'] == 200){
							let result = res['responseJSON'];
							if( result && result['valid']){
								this.menu.enable(true);
								this.navCtrl.setRoot(HomePage);
								this.config.userInfo.token = result['token_type']+" "+result['access_token'];
	
							/* Invalid pass-code for 3 times, show error of maximum attempts and navigate to login screen */
							}else if(!result.valid_token || result.valid_count >= 3){
								/**remove data from jsonStore */
						
								if(result['valid_count'] >= 3)
									this.utils.showToastMsg(this.strings.passcodeblocked);
								else if(result['auth_token'] != null && result['auth_token'] == false)
									this.utils.showToastMsg(this.strings.authenticationFail);
								else if(!result['valid_token'])
									this.utils.showToastMsg(this.strings.passcodeIsExpired);
						
									this.goToLoginPage();
							}
							else if(!result['valid_passcode']){
								/** invalid passcode */
								this.loginPassCode = [];
								this.utils.showToastMsg(this.strings.wrongpasscode);
									/** TODO: need to implement device vobrate */
							}else if(!result.valid_password){
								this.utils.showToastMsg(this.strings.PasscodeValidationFail);
								this.goToLoginPage();
							}
						}else{
							/**false: Toast message and handling error */
							this.service.handlingErrorResponse(false,res);
						}
					}catch(err){
						this.logger.error("touch id login catch error "+JSON.stringify(err));
					}
				},(err)=>{
					this.utils.hideLoader();
					this.loginPassCode = [];
					this.utils.showToastMsg(this.strings.serverError);
					this.logger.error("touch id login failure error "+JSON.stringify(err));
				});
	
			}else{
				this.loginPassCode = [];
				this.utils.showToastMsg(this.strings.noNetwork);
			}
		}
	}
