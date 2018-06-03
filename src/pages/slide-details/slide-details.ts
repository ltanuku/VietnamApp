import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { StringsProvider } from '../../providers/strings/strings';
import { AdapterServiceProvider } from "../../providers/adapter-service/adapter-service";
import { SlideListPage } from '../slide-list/slide-list';
import { FooterBarComponent } from '../footer-bar/footer-bar';
import {SlideDetailsServiceProvider} from './slide-details-service'
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
import { UtilsProvider } from '../../providers/utils/utils';

/**
 * Generated class for the SlideDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slide-details',
  templateUrl: 'slide-details.html',
})

export class SlideDetailsPage {

	articleID: number;
	slideDetails: object=[];
	previousPage:string;
	@ViewChild(Content) content;
	alignBottom: any = '';
	isLicenseUpdated : boolean = false;

	constructor(private navCtrl: NavController, private navParams: NavParams, private strings: StringsProvider,private utils: UtilsProvider,
		private logger: LoggerServiceProvider, private slideDetailsService: SlideDetailsServiceProvider, private service: AdapterServiceProvider,) {
		service.analytics("Slide Details");


		this.updateLicenseTextPosition();
		
			  // Event listener to udpate the height of events div
				window.addEventListener("orientationchange", () => {
			  
					this.isLicenseUpdated = false;
					this.updateLicenseTextPosition();
			  
				  }, false);

/**Getting article from previous page */
			if(navParams.get("pageFrom")){
				this.previousPage = navParams.get("pageFrom");
			}
		this.articleID = navParams.get("articleId");
		if(this.articleID != undefined){

	      	if(this.utils.isDeviceOnLine()){
				slideDetailsService.getBannerDetails(this.articleID).then((res)=>{
					try{
						this.utils.hideLoader();
						this.logger.log("BannerDetails Response:"+res);
						/**verifing status */
						if(res['responseJSON'] && res['responseJSON']['statusCode'] == 200){
							/**Validating success */
						  if(res['responseJSON']['result'] && res['responseJSON']['result'].toUpperCase()  == "SUCCESS" ){

								this.slideDetails = res['responseJSON'];
								this.slideDetails['image']  = "data:image/jpeg;base64,"+this.slideDetails['image'];

								this.updateLicenseTextPosition();
						  }else{
							 /** true for back navigation  and no data  message*/
								this.service.showMessagePopup(true,res['responseJSON']['message']);
							  }
						}
						else{

							/**true: popup message and handling error */
							this.service.handlingErrorResponse(true,res);
							}
					}catch(err){
						this.logger.error("getBannerDetails catch error :"+JSON.stringify(err));
					}

				},(err)=>{
					/** true for back navigation  and no server  message*/
					this.service.showMessagePopup(true,this.strings.serverError);

					this.utils.hideLoader();
					this.logger.error("getBannerDetails failure error:"+JSON.stringify(err));

				});
		      }else{
				/** true for back navigation  and no error  message*/
				this.service.showMessagePopup(true,this.strings.noNetwork);
		      }

		}	}



	  /**navigation to slide listpage */
	slideList(category){
		if(this.previousPage != "homePage"){
			this.navCtrl.pop();

		}else{
			this.navCtrl.push(SlideListPage,{category:category});
		}

	}

	/**Back button functionality */
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
