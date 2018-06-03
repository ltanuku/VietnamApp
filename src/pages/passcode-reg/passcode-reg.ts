import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PasscodePage } from "../passcode/passcode";
import { LoginPage } from "../login/login";
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { JsonStoreProvider } from "../../providers/json-store/json-store";
import { AdapterServiceProvider } from "../../providers/adapter-service/adapter-service";
/**
 * Generated class for the PasscodeRegPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-passcode-reg',
  templateUrl: 'passcode-reg.html',
})
export class PasscodeRegPage {

	registerPassCode:any=[];
	regPasscode :any;
	
	constructor(public navCtrl: NavController, public navParams: NavParams, public strings: StringsProvider,private utils:UtilsProvider, private jsonStore :JsonStoreProvider, public service: AdapterServiceProvider) {
		service.analytics("Passcode Registration");
	}

	ionViewWillEnter() {
		
		this.registerPassCode = [];
	}
	
	

	/**Register passcode enter events */
	passcodeRegister(event){
		if(this.registerPassCode.length < 4 && (event.srcEvent.srcElement.innerText[0] != undefined  && event.srcEvent.srcElement.innerText[0] != "" ))
			this.registerPassCode.push(event.srcEvent.srcElement.innerText[0]);

		if(this.registerPassCode.length == 4){
			this.navCtrl.push(PasscodePage,{"register":this.registerPassCode});
		}
	}

	
	/** delete passcode **/
	deletepasscode(){
		if(this.registerPassCode.length <= 4 && this.registerPassCode.length>0)
			this.registerPassCode.pop();
	}
}
