import { ConfigProvider } from './../../providers/config/config';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { AdapterServiceProvider } from "../../providers/adapter-service/adapter-service";
import { UtilsProvider } from '../../providers/utils/utils';
import { StringsProvider } from '../../providers/strings/strings';
import { FooterBarComponent } from '../footer-bar/footer-bar';
import { DetailsProvider } from '../search-details/details';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';

/**
 * Generated class for the SearchDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-details',
  templateUrl: 'search-details.html',
})
export class SearchDetailsPage {

	results: any = {};
	detailList:any;
	policyNo: any;
	underwritingDetails: any;
	policyIssuedDetails: any;
	serviceCallCompleted : boolean = false ;
	cardTitle: any;
	@ViewChild(Content) content;
	alignBottom: any = '';
	isLicenseUpdated : boolean = false;
	issuedDetails: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public service: AdapterServiceProvider,
		private strings:StringsProvider, public detailsService: DetailsProvider,private logger: LoggerServiceProvider,
		public utils: UtilsProvider, public config : ConfigProvider) {

		service.analytics("Search Details");
		this.detailList = navParams.get("color");
		this.policyNo = navParams.get("policyNo");
		this.underwritingDetails = navParams.get("underwriting");
		this.cardTitle = navParams.get("cardTitle");
		this.issuedDetails = navParams.get("issuedDetails");

		this.searchDetails();
	}

	/** getting data from policy issued service */
	searchDetails(){

	if(this.utils.isDeviceOnLine()){
		this.detailsService.getSearchDetails(this.policyNo, this.underwritingDetails).then((res)=>{
			try {
				this.serviceCallCompleted = true;
				this.logger.log("search Result:"+res['responseJSON']);
				this.utils.hideLoader();
				/**validating success response */
				if(res['responseJSON'] && res['responseJSON']['result'].toUpperCase() == "SUCCESS" && !res['responseJSON']['message']  ){
					/**assigning results to array */
					this.results = res['responseJSON'];

					if(!this.isLicenseUpdated){
						// Let the content update the scroll height
						setTimeout(() => {
							// Change the style to position : relative, to move the license below the content.
							if (this.content.getContentDimensions().scrollHeight > this.content.getContentDimensions().contentHeight) {
								this.alignBottom = this.utils.getLicenseTextStyles();

								this.isLicenseUpdated = true;
							}
						}, 200);
					}

				}else{
					this.utils.hideLoader();
					/** true for back navigation  and no data  message*/
					this.service.showMessagePopup(true,res['responseJSON']['message']);
				}
			}catch (err){
				this.logger.error(err);
				this.utils.hideLoader();

				this.logger.error("search details catch error : " +JSON.stringify(err));
			}

		},(err)=>{
			this.serviceCallCompleted = true;
			this.utils.hideLoader();
			/** true for back navigation  and no server  message*/
			this.service.showMessagePopup(true,this.strings.serverError);

			this.logger.error("search details failure : " +JSON.stringify(err));

		});
	}else{

		/** true for back navigation  and no error  message*/
		this.service.showMessagePopup(true,this.strings.noNetwork);

	}


 }

/** Back button functionality */
goBack ()  {
	this.navCtrl.pop();
}

 /* showing data failure message and server failure message **/
 showMessagePopup(message){
	this.utils.showMessage("uyguyguyg",message,[{
		text:this.strings.popUpOk,
		handler:()=>{
					this.navCtrl.pop();
			}
		}]);
	}
}
