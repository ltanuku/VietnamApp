import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { StringsProvider } from '../../providers/strings/strings';
import { AdapterServiceProvider } from "../../providers/adapter-service/adapter-service";
import { UtilsProvider } from '../../providers/utils/utils';
import {LoggerServiceProvider} from '../../providers/logger-service/logger-service';
import {ConfigProvider} from '../../providers/config/config';
import {MyProfileServiceProvider} from './my-profile-service';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
	profileData: any = [];
	profilePic:any;
	profilePicStyle : any;
	serviceCallCompleted : boolean = false;
	noScroll: boolean = true;

	@ViewChild(Content) content: Content;
	alignBottom: any = '';
	isLicenseUpdated : boolean = false;


	constructor(public navCtrl: NavController, public navParams: NavParams, public strings: StringsProvider,public config : ConfigProvider,
		 public service: AdapterServiceProvider, public utils: UtilsProvider, private logger :LoggerServiceProvider,private myprofileService :MyProfileServiceProvider) {
			
			// "../assets/icon/profilepic.jpg"; //this.config.userInfo.userPic;		
			this.profilePic = this.config.userInfo.userPic;
			this.profileData = [];

			this.updateLicenseTextPosition();
			
				  // Event listener to udpate the height of events div
					window.addEventListener("orientationchange", () => {
				  
						this.isLicenseUpdated = false;
						this.updateLicenseTextPosition();
				  
					  }, false);
		}

	ionViewDidLoad() {
		if(this.utils.isDeviceOnLine()){
			this.myprofileService.getProfile().then((res)=>{						
				this.profileSuccess(res);
				this.serviceCallCompleted = true;
			},(e)=>{
				this.serviceCallCompleted = true;
				/** server error */
				this.showMessagePopup(this.strings.serverError);
			
				this.utils.hideLoader();

				/** Hide scroll when loader displayed */
				this.noScroll = false;


				this.logger.error("profile service fail : " +JSON.stringify(e));
			});
		}else{
			/**Net error */
			this.showMessagePopup(this.strings.noNetwork);
		}	
		
	}
	
	profileSuccess(res){
		try {			
			this.utils.hideLoader();

			/** Hide scroll when loader displayed */
			this.noScroll = false;

			if (res['responseJSON'] && res['responseJSON']['statusCode'] == 200 && res['responseJSON']['result'].toUpperCase() == "SUCCESS") {
				this.profileData = res['responseJSON'];			
				
				this.updateLicenseTextPosition();
			}else{
				
				/**no message popup */
				this.showMessagePopup(res['responseJSON']['message']);
				
			}					
		
		} catch (e) {
			this.utils.hideLoader();

			/** Hide scroll when loader displayed */
			this.noScroll = false;
		 	this.logger.error("profileSuccess catch error : " +JSON.stringify(e));
		}
	}

 /* showing data failure message and server failure message **/
 showMessagePopup(message){
	this.utils.showMessage("",message,[{
		text:this.strings.popUpOk,
		handler:()=>{
			this.navCtrl.pop();
		}
	}]);
}

 /** Calculate and set the position of the license text */
 updateLicenseTextPosition(){
	if(!this.isLicenseUpdated){
		// Let the content update the scroll height
		setTimeout(() => {
			// Change the style to position : relative, to move the license below the content.
			if (this.content.getContentDimensions().scrollHeight > this.content.getContentDimensions().contentHeight) {
				this.alignBottom = this.utils.getLicenseTextStyles();

				this.isLicenseUpdated = true;
			}else{
				this.alignBottom = { 'position': 'absolute' };
			}
		}, 200);
	}
}

}
