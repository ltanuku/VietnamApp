import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AdapterServiceProvider } from '../../providers/adapter-service/adapter-service';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
	forgotForm : FormGroup;
	email :any;
	userID: any;
	mobile: any;
	emailMobile: any= 'email'; 
	isEmailFoucs:boolean = false;
	isMobileFoucs:boolean = false;
	isErrorEmail: boolean = false;
	isErrorMobile: boolean = false;
	
	constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder,public service:AdapterServiceProvider,
		public utility: UtilsProvider, public strings: StringsProvider) {
		service.analytics("Forget Password");
		
		this.forgotForm = fb.group({
		 // 'userID': ['', [Validators.required, Validators.minLength(6),Validators.pattern('[a-zA-Z0-9_.]*')]],
		  //'email': ['', [Validators.required, Validators.pattern('w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$')]],//
		  'email': ['', [Validators.required, Validators.email]],
		  'mobile': ['', [Validators.required, Validators.pattern('[(\+62|0|62)+\d{9,16}]')]],
		  'emailMobile':[]
		});

		//this.userID = this.forgotForm.controls['userID'];
		this.email = this.forgotForm.controls['email'];
		this.mobile = this.forgotForm.controls['mobile'];
	}
	
	ionViewDidLoad() {
		
	}
	  
		
	focusOut(value){
		if(value == "email" && this.email._value == ""){
			this.isMobileFoucs = false;
			this.isErrorMobile = false;
			this.isErrorEmail = true;
		}else if(value == "phone" && this.mobile._value == ""){
			this.isEmailFoucs=false;
			this.isErrorEmail = false;
			this.isErrorMobile = true;
		}
		
		if(value == "email" && this.email._value != ""){			
			this.isErrorMobile = false;
			this.isErrorEmail = true;
		}else if(value == "phone" && this.mobile._value != ""){
			this.isErrorEmail = false;
			this.isErrorMobile = true;
		}
	}
	
	/** forgot password submit button **/
	PasswdForm(forgotform){

		/* this.isEmailFoucs = false;
		this.isMobileFoucs =false; */

		//if(forgotform.controls.userID.valid){
			let paramType ,paramValue;
			if(forgotform.controls.email.valid){
				paramType = "email";
				paramValue = this.email;
			}else if(forgotform.controls.mobile.valid){
				paramType= "mobile";
				paramValue = this.mobile;
			}else
				return false;

			/*this.service.forGotpassword(this.userID,paramType,paramValue).then((res)=>{
				this.utility.hideLoader();

			},(err)=>{
				this.utility.hideLoader();
			});*/
		//}
	}

}
