import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IonicPage, NavController, MenuController, Platform, Content } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HomePage } from '../home/home';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { AdapterServiceProvider } from '../../providers/adapter-service/adapter-service';
import { Md5 } from 'ts-md5/dist/md5';
import { JsonStoreProvider } from "../../providers/json-store/json-store";
import { ConfigProvider } from "../../providers/config/config";
import { PasscodeRegPage } from "../passcode-reg/passcode-reg";
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
import { Keyboard } from '@ionic-native/keyboard';
import {LoginServiceProvider} from './login-service';

/*import * as bcryptjs from "bcryptjs";*/
declare var WL;

/**
 * Generated class for the LoginPage page.
 *ConfigProvider
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {
	
	@ViewChild('usernameItem', { read: ElementRef }) loginIDItem : ElementRef;
	@ViewChild('passwordItem', { read: ElementRef }) pwdItem : ElementRef;
	@ViewChild(Content) content: Content;

	loginForm: FormGroup;
	loginID: any;
	passwd: any;
	hash: any;
	isKeyboardHidden: boolean = true;
	tempPassword : string = "$2a$04$Vbug2lwwJGrvUXTj6z7ff.97IzVBkrJ1XfApfGNl.Z695zqcnPYra";
	isUserFoucs : boolean = false;
	isPwdFocus : boolean = false;

	constructor(public platform: Platform, public navCtrl: NavController, private fb: FormBuilder,
		public service: AdapterServiceProvider, public menu: MenuController, public jsonstore: JsonStoreProvider,private loginService :LoginServiceProvider,
		public utils: UtilsProvider, public strings: StringsProvider, public config: ConfigProvider, private logger: LoggerServiceProvider,
		private keyboard: Keyboard) {

			
		service.analytics("Login");

		this.loginForm = fb.group({
			'loginID': ['', [Validators.required, Validators.minLength(4),
			Validators.pattern('[a-zA-Z0-9_]*')]],
			'passwd': ['', [Validators.required, Validators.minLength(8)]],
		});

		this.loginID = this.loginForm.controls['loginID'];
		this.passwd = this.loginForm.controls['passwd'];

		/** Hide footer on keyboard open */
		keyboard.onKeyboardShow().subscribe(() => {
			this.isKeyboardHidden = false;
			setTimeout(() => { // this to make sure that angular's cycle performed and the footer removed from the DOM before resizing
				this.content.resize();

			}, 200);
		});

		/** show footer on keyboard open */
		keyboard.onKeyboardHide().subscribe(() => {
			this.isKeyboardHidden = true;
			setTimeout(() => { // this to make sure that angular's cycle performed and the footer removed from the DOM before resizing
				this.content.resize();
			}, 200);
		});

	}

	ngDoCheck() {
		setTimeout(() => {
			if(this.loginIDItem.nativeElement.classList.contains('item-input-has-focus')) {
				this.isUserFoucs = true;
			} else{
				this.isUserFoucs = false;
			}

			if(this.pwdItem.nativeElement.classList.contains('item-input-has-focus')) {
				this.isPwdFocus = true;
			} else{
				this.isPwdFocus = false;
			}
		}, 150);
	  } 
	  

	ionViewDidLoad() {
		this.menu.enable(false);
	}

	/** login form submit button  **/
	login(formData) {
		let deviceuid = this.utils.getDeviceId();
		
		if (formData.valid) {
			//let tempPasswd = this.passwd.value;
			let loginAvail = null;
			let encryptedPasswd = this.service.encryptPassword(this.passwd.value);
			// this.loginID = "user"; 

			if (this.utils.isDevice()) {

				this.jsonstore.getJsonStoreData(this.jsonstore.collectionNames.userDetails).then((res: any = []) => {
					if (res[0] && res[0].length > 0) {
						loginAvail = 'login';
					}
				}, (error) => {
					this.logger.error("Login json user info get Error " + JSON.stringify(error));
				});
				
				/** device login authentication **/
				this.loginService.userLogin(this.loginID.value, encryptedPasswd, deviceuid, loginAvail).then((res) => {
					this.loginSuccess(res);
				}, (err) => {
					this.utils.showToastMsg(this.strings.serverError);
					this.utils.hideLoader();
					//this.menu.enable(true);
					//this.navCtrl.setRoot(HomePage);
					this.logger.error("Login service fail Error " + JSON.stringify(err));
				});
			}
			else {

				/** device login authentication **/
				this.loginService.userLogin(this.loginID.value, encryptedPasswd, deviceuid, loginAvail).then((res) => {
					this.loginSuccess(res);
				}, (err) => {
					this.utils.hideLoader();
					this.utils.showToastMsg(this.strings.serverError);

					this.menu.enable(true); // remove this  2 lines code
				this.navCtrl.setRoot(HomePage);
				});

			}
		}
	}

	/** login success function **/
	loginSuccess(res) {
		try {
			if (res['responseJSON'] && res['responseJSON']['statusCode'] == 200) {

				if (res['responseJSON'] && res['responseJSON']['result'].toUpperCase() == "SUCCESS") {

					this.config.userInfo.userID = res['responseJSON']['userID'];
					this.config.userInfo.agentCode = res['responseJSON']['agentCode'];
					this.config.userInfo.token = res['responseJSON']['token_type']+" "+res['responseJSON']['access_token'];
					this.config.userInfo.userType = res['responseJSON']['userType'];
					/** checking platform type devivce or web**/
					if (this.utils.isDevice()) {
						this.config.userInfo.deviceID = this.utils.getDeviceId();
						this.navCtrl.setRoot(PasscodeRegPage);
					} else {
						this.navCtrl.setRoot(HomePage);
						this.menu.enable(true);
					}
				}else{
					this.utils.showToastMsg(res['responseJSON']['message']);
				} 
			}else{
				this.service.handlingErrorResponse(false,res);
			}
			this.utils.hideLoader();
		} catch (e) {
			this.logger.error("loginSuccess catch eror : " + JSON.stringify(e));
		}
	}

}
