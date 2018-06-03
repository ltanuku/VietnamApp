import { ConfigProvider } from './../../providers/config/config';
import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,Content } from 'ionic-angular';
import { StringsProvider } from '../../providers/strings/strings';
import { SearchDetailsPage } from '../search-details/search-details';
import { AdapterServiceProvider } from "../../providers/adapter-service/adapter-service";
import { UtilsProvider } from "../../providers/utils/utils"
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
import { PolicyListProvider } from '../search-results/policy-list';
/**
 * Generated class for the SearchResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-results',
  templateUrl: 'search-results.html',
})
export class SearchResultsPage {

	@ViewChild(Content) content;
	selectedPage: any;
	title: any = "";
	pageNum:number = 0;
	totalrows :number;
	results: any = [];
	previousPage: any;
	alignBottom: any = '';
	isLicenseUpdated : boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public strings: StringsProvider,
		 public service: AdapterServiceProvider, private logger : LoggerServiceProvider, private utils: UtilsProvider,
		 public policyService: PolicyListProvider, public alertCtrl: AlertController, private config: ConfigProvider) {
		service.analytics("Search Results");

		this.previousPage = navParams.get("page");

		/** get colour code on basis of previous page */
		switch(this.previousPage){

			case strings.waitingForAck:
				this.selectedPage = {"waitingForAck":"true","pathKey":"waitingForAck", "cardColor": config.colorCodes.waitingForAckColor  } ;
				break;
			case strings.inGracePeriod:
				this.selectedPage = {"inGracePeriod":"true","pathKey":"inGracePeriod", "cardColor":  config.colorCodes.inGracePeriodColor  } ;
				break;
			case strings.cancelGraceInPeriod:
				this.selectedPage = {"cancelGracePeriod":"true","pathKey":"cancelGracePeriod", "cardColor": config.colorCodes.cancelGracePeriodColor  } ;
				break;
			case strings.inPremiumPeriod:
				this.selectedPage = {"inPremiumPeriod":"true","pathKey":"inPremiumPeriod", "cardColor": config.colorCodes.inPremiumPeriodColor  } ;
				break;
			case strings.lapsed:
				this.selectedPage = {"lapsed":"true","pathKey":"lapsed", "cardColor": config.colorCodes.lapsedColor  } ;
				break;
			case strings.insuranceFee:
				this.selectedPage = {"claimStatus":"true","pathKey":"claimStatus", "cardColor": config.colorCodes.insuranceFeeColor  } ;
				break;

			default:
				this.selectedPage = {"claimStatus":"true","pathKey":"claimStatus", "cardColor": config.colorCodes.defaultColor } ;

		}

		/** calling policy List service */
		this.policyList(undefined);

		this.updateLicenseTextPosition();
		
			  // Event listener to udpate the height of events div
				window.addEventListener("orientationchange", () => {
			  
					this.isLicenseUpdated = false;
					this.updateLicenseTextPosition();
			  
				  }, false);
	}

	policyList(infinite){

 if (this.utils.isDeviceOnLine()) {
		this.policyService.getPolicyList(this.pageNum, this.selectedPage.pathKey).then((res)=>{
			try {
				 if(infinite != undefined)
					infinite.complete();

				this.logger.log("search Result:"+res['responseJSON']);
				this.utils.hideLoader();

				/**validating success response */
				if (res['responseJSON'] && res['responseJSON']['statusCode'] == 200 && res['responseJSON']['result'].toUpperCase() == "SUCCESS"){

					/**checking results array available */
					if(res['responseJSON']['datas'] && res['responseJSON']['datas'].length>0){

						/**getting page number  */
					    this.totalrows = res['responseJSON']['totalRows'];
						this.pageNum ++;

						this.results =this.results.concat(res['responseJSON']['datas']);

						this.updateLicenseTextPosition();

					}else{
						if(infinite != undefined)
						infinite.enable(false);
						else{
					/** true for back navigation  and no data  message*/
						this.service.showMessagePopup(true,res['responseJSON']['message']);

						}


					}
				}else{

					/**true: popup message and handling error */
					this.service.handlingErrorResponse(true,res);
				}
			}catch (err){
				this.logger.error("policy list catch error "+JSON.stringify(err));
			}

		},(err)=>{
					/** true for back navigation  and server  message*/
						this.service.showMessagePopup(true,this.strings.serverError);
			if(infinite != undefined)
				infinite.complete();
			this.utils.hideLoader();
			this.logger.error("policy list failure "+JSON.stringify(err));
		});

	}else{
		/** true for back navigation  and no error  message*/
		this.service.showMessagePopup(true,this.strings.noNetwork);

	}
}

	/** Load more functionality for more data */
	getMorePolicyList(infinite){
		if( this.totalrows == this.utils.pageSize){
			this.policyList(infinite);
		}else{
			infinite.enable(false);
		}
	}


	/**Search result details */
	details(policyno){
		this.navCtrl.push(SearchDetailsPage,{"color":this.selectedPage, "policyNo":policyno, "cardTitle": this.previousPage});
	}

	/** Back button functionality */
	goBack ()  {
		this.navCtrl.pop();
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
