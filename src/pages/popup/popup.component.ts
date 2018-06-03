import { Component } from '@angular/core';
import { ViewController, NavParams,NavController ,Platform} from 'ionic-angular';
import { AdapterServiceProvider } from "../../providers/adapter-service/adapter-service";
import { UtilsProvider } from '../../providers/utils/utils';
import { LoginPage } from '../login/login';
import { StringsProvider } from '../../providers/strings/strings';
@Component({
  selector: 'page-popup',
  templateUrl: 'popup.html',
})
export class popupPage {

  public title;
  public confirmState;
  constructor(public viewCtrl: ViewController, params: NavParams ,  private service: AdapterServiceProvider , private utility: UtilsProvider,public navCtrl: NavController,public platform: Platform , public strings: StringsProvider) {
		this.title = params.get('title');
		this.confirmState = params.get('confirmState');
  }
	/** logout the user */
	agree(){
		if(this.confirmState == "exit")
			this.platform.exitApp();
		
		else{
			if (this.utility.isDevice()) {
				this.service.clearUserCacheData();
				this.navCtrl.setRoot(LoginPage);
			}
		}
	}
	/** cloase the popup */
	close(){
		this.navCtrl.pop();
	}


}