import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { StringsProvider } from '../../../providers/strings/strings';
import { AdapterServiceProvider } from "../../../providers/adapter-service/adapter-service";
import { UtilsProvider } from '../../../providers/utils/utils';
import { LoggerServiceProvider } from '../../../providers/logger-service/logger-service';
import { SunEliteServiceProvider } from '../../../pages/sun-elite/sun-elite-service';
import {ConfigProvider}from '../../../providers/config/config';
/**
 * Generated class for the SunElitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sun-elite-unit',
  templateUrl: 'sun-elite-unit.html',
})
export class SunElitePageUnit {

	/** Get ProgressBar element */
	@ViewChild('moveProgress') moveProgress;
	@ViewChild(Content) content;

	alignBottom: any = '';
	isLicenseUpdated : boolean = false;
	progress: any;
	
	sunEliteVal : any = [];
	isAgentList: string = 'inactive';
	sunEliteGoal: any;
	progressWidth: any;
	target1: any;
	target2: any;
	target3: any;
	bar: any;
	dataSuccess: any;
	noScroll: boolean = true;
	
	selectedID:any
	agentsList :any = [];
	selectedAgentLevel :any;
	serviceCallCompleted : boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams,public strings: StringsProvider, private  service: AdapterServiceProvider,
		public config : ConfigProvider,public utils: UtilsProvider,private logger : LoggerServiceProvider, public sunEliteService: SunEliteServiceProvider) {
		service.analytics("SunElite Unit");
		
		/** Hide ProgressBar until service response success */
		this.dataSuccess = {'opacity' : 0};
		
		if(this.config.userInfo.agentsList.length >0){
			
			this.agentsList = this.config.userInfo.agentsList;
			/**by deafult first userid selectd */
			this.selectedAgentLevel = this.agentsList[0]['agentLevel']+"-"+this.agentsList[0]['agentCode']+"-"+this.agentsList[0]['agentName']; 
			this.selectedID = this.agentsList[0]['agentCode'];
			/** calling SunElite Unit service */
			this.sunEliteUnit(this.agentsList[0]['agentCode']);
		}else{
			/** true for back navigation  and nodata message*/
			this.service.showMessagePopup(false,this.strings.noData);
			this.noScroll = false;
		}

		this.updateLicenseTextPosition();
		
			  // Event listener to udpate the height of events div
				window.addEventListener("orientationchange", () => {
			  
					this.isLicenseUpdated = false;
					this.updateLicenseTextPosition();
			  
				  }, false);
		
	}
	
	/** agents list click event */
	setAction (item, selectedID){
		
		this.selectedID = selectedID;
		this.isAgentList  == 'active'? this.isAgentList = 'inactive' : this.isAgentList = 'active';
		this.selectedAgentLevel = item.agentLevel+"-"+item.agentCode+"-"+item.agentName;
		this.sunEliteUnit(selectedID);
		this.sunEliteVal = [];
	}

	/** Getting Data from SunElite Unit SErvice */
	sunEliteUnit(agentID){
		if (this.utils.isDeviceOnLine()) {
			this.sunEliteService.getSunEliteUnitData(agentID).then((res)=>{
				try{
					this.serviceCallCompleted = true;
					this.utils.hideLoader();

					/** Hide scroll when loader displayed */
					this.noScroll = false;

					this.logger.log("SunElite Unit Service success response"+JSON.stringify(res));
					if(res['responseJSON'] && res['responseJSON']['statusCode'] == 200 && res['responseJSON']['result'].toUpperCase()  == "SUCCESS"){
						this.content.scrollToTop();
											
						this.sunEliteVal = res['responseJSON'];
						
						/** show Progress bar on success */
						this.dataSuccess = {'opacity' : 1};
						
						/** Added 20% to the target amount as per by Indo App */
						this.sunEliteGoal = this.sunEliteVal.targeT_AMOUNT_4 + ((this.sunEliteVal.targeT_AMOUNT_4 / 100) * 20);					
						this.progressWidth = ((this.sunEliteVal.fyp / this.sunEliteGoal) * 100);

						this.target1 = ((this.sunEliteVal.targeT_AMOUNT_1 / this.sunEliteGoal) * 100);
						this.target2 = ((this.sunEliteVal.targeT_AMOUNT_2 / this.sunEliteGoal) * 100);
						this.target3 = ((this.sunEliteVal.targeT_AMOUNT_3 / this.sunEliteGoal) * 100);
						
						this.updateProgressBarTransition(this.progress, "width 0.5s linear");

						this.updateLicenseTextPosition();
					}else{
					
						/**display popup with message */
						this.utils.showMessage("",res['responseJSON']['message'],[{
							text:this.strings.popUpOk,
							handler:()=>{
								this.navCtrl.pop();
							}
						}]);
				
					} 
				}catch(e){
					this.utils.hideLoader();

					/** Hide scroll when loader displayed */
					this.noScroll = false;

					this.logger.error("SunElite Unit Service catch error "+JSON.stringify(e));
				}
			},(err)=>{
				this.serviceCallCompleted = true;
				this.utils.hideLoader();

				/** Hide scroll when loader displayed */
				this.noScroll = false;

				this.logger.error("SunElite Unit Service failure "+JSON.stringify(err));
				this.showMessagePopup(this.strings.serverError);
			});
		}else{
			this.showMessagePopup(this.strings.noNetwork);
		}
	}

	/* showing data failure message and server failure message **/
	showMessagePopup(message){
		this.utils.showToastMsg(message);
	}
	
	/** 
	* 	To show transition from 0 to value, on change of Agent in drop-down,
	* 	set the width of progress bar to 0 and change it to value on server response.  
	*
	*	@element:  -- className of ProgressBar.
	*	@style: -- Style to set for ProgressBar transition
	*/
	updateProgressBarTransition(element, style){
		this.bar = element.classList;
		
		for(var i = 0; i < this.bar.length; i++){
		
			/* TO load the transition from the beginning , To fix transition not updating issue */
			this.sunEliteVal.fyp =0;
			element.style.transition = style;
		}	
	}
	
	/** toggle agent Tree */
	showAgentList(){
		this.isAgentList  == 'active'? this.isAgentList = 'inactive' : this.isAgentList = 'active';
	}
	
	/** close agent tree dropdown when change tabs */
	ionViewWillLeave() {
		this.isAgentList = 'inactive';
	}

	ionViewDidLoad() {
		/** passing progressBar element as arg for animation */
		this.progress = this.moveProgress.nativeElement;		
		this.updateProgressBarTransition(this.progress, "width 0s linear");
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
