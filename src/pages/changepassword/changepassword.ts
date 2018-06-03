import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdapterServiceProvider } from "../../providers/adapter-service/adapter-service";
import { ConfigProvider } from "../../providers/config/config";
import { Md5 } from 'ts-md5/dist/md5';
import { StringsProvider } from '../../providers/strings/strings';
import {UtilsProvider} from '../../providers/utils/utils';
import {ChangepasswdServiceProvider} from './changepasswd-service';
import {LoggerServiceProvider} from '../../providers/logger-service/logger-service';
import {LoginPage} from '../../pages/login/login';
/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {

	changePasswdForm : FormGroup;
	//oldPasswd:any;
	newPasswd:any;
	confPasswd:any;
//	isOldFoucs:boolean =true;
	isConfFoucs:boolean = true;
	isNewFoucs:boolean =true;
  
	constructor( private fb: FormBuilder,public navCtrl: NavController, public navParams: NavParams,private service : AdapterServiceProvider,private logger: LoggerServiceProvider,
		private config: ConfigProvider, public strings: StringsProvider,private utils: UtilsProvider,private changepassService :ChangepasswdServiceProvider) {
		service.analytics("Change Password");
		
		/** initilizing  form with required variables **/
		this.changePasswdForm = fb.group({
		 // 'oldPasswd':['',[Validators.required,Validators.minLength(8)]], '[a-zA-Z0-9_]*'
		  'newPasswd':['',[Validators.required,Validators.minLength(8)]],
		  'confPasswd':['',[Validators.required,Validators.minLength(8)]]
		});
		/** assigning values to form controls **/
	//	this.oldPasswd = this.changePasswdForm.controls['oldPasswd'];
		this.newPasswd = this.changePasswdForm.controls['newPasswd'];
		this.confPasswd = this.changePasswdForm.controls['confPasswd'];
	}
	
	/**Back button functionality */
	changePassBack(){
		this.navCtrl.pop();
	}
	
	/** changepassword form submit button ***/
	changePswdFormSubmit(changePassedForm) {
	///	this.isOldFoucs = false;
		this.isConfFoucs = false;
		this.isNewFoucs = false

		/** checking chnagepassword form valid and new and confpasswd matc **/
		if(changePassedForm.valid && (this.confPasswd.value == this.newPasswd.value)){

		let userID = (this.config.userInfo.userID);
		userID= userID.toUpperCase();
			if(this.utils.isDeviceOnLine()){
				this.changepassService.changePassword(this.newPasswd.value).then((res)=>{
					try{
						this.logger.log("changepassService success response"+JSON.stringify(res));
						/* validating success response */
						if(res['responseJSON'] && res['responseJSON']['statusCode'] == 200 && res['responseJSON']['result'].toUpperCase()  == "SUCCESS"){
							
							/**clear the stored details and navigate to login page */
							this.service.clearUserCacheData();
						this.navCtrl.setRoot(LoginPage);							

						}else{

							this.utils.showToastMsg(res['responseJSON']['message']);
						}	
		  
					} catch (e){
		  
					}
				  },(err)=>{

					this.utils.hideLoader();
					this.utils.showToastMsg(this.strings.serverError);
		  
				  });

			}else{
				this.utils.showToastMsg(this.strings.noNetwork);
			}
       
    }

  }

}
