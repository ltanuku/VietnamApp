import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { StringsProvider } from '../../providers/strings/strings';
import { AdapterServiceProvider } from "../../providers/adapter-service/adapter-service";
import { FooterBarComponent } from '../footer-bar/footer-bar';
import {SlideListServiceProvider} from './slide-list-service';
import {LoggerServiceProvider} from '../../providers/logger-service/logger-service';
import {UtilsProvider} from  '../../providers/utils/utils';
import {SlideDetailsPage} from '../../pages/slide-details/slide-details';
/**
 * Generated class for the SlideDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slide-list',
  templateUrl: 'slide-list.html',
})
export class SlideListPage {

	imgDetails: any;
	itemListArray : any;
	category: string;
	pageNum :number = 0;
	totalRows :number =0;
	slideList: any =[];
	@ViewChild(Content) content;
	alignBottom: any = '';
	isLicenseUpdated : boolean = false;

	constructor(private navCtrl: NavController, private navParams: NavParams, private strings: StringsProvider, private utils: UtilsProvider,
		private service: AdapterServiceProvider, private slideListService: SlideListServiceProvider,private logger: LoggerServiceProvider) {

		service.analytics("Slide List");
	this.category = this.navParams.get('category');
			this.getBannerListDetails(undefined);

			this.updateLicenseTextPosition();
			
				  // Event listener to udpate the height of events div
					window.addEventListener("orientationchange", () => {
				  
						this.isLicenseUpdated = false;
						this.updateLicenseTextPosition();
				  
					  }, false);
	}

	/**getting banner list by passing  category and pagenum*/
	getBannerListDetails(infinite){

		if (this.utils.isDeviceOnLine()) {

			this.slideListService.getBannerListData(this.category,this.pageNum).then((res)=>{
				try{
					/** hiding loadmore icon */
					if(infinite != undefined)
					infinite.complete();
					this.utils.hideLoader();
					this.logger.log("getBannerListDetails sucess response"+JSON.stringify(res));
					if(res['responseJSON'] && res['responseJSON']['statusCode'] == 200 && res['responseJSON']['result'].toUpperCase()  == "SUCCESS"){
						/**Validating data array */
					  if(res['responseJSON']['datas'].length >0 ){
							this.slideList = res['responseJSON']['datas'];

							this.updateLicenseTextPosition();
						 }else{
							if(infinite != undefined)
								infinite.enable(false);
							else
								/** true for back navigation  and popup message*/
								this.service.showMessagePopup(true,res['responseJSON']['message']);
					      }
					}
					else{
						/**true: popup message and handling error */
						this.service.handlingErrorResponse(true,res);
						}
				}catch(e){
					this.logger.error("getBannerListDetails catch error "+JSON.stringify(e));
				}

			},(err)=>{
				/** hiding loadmore icon */
				if(infinite != undefined)
				infinite.complete();
				this.utils.hideLoader();
				this.logger.error("getBannerListDetails failure "+JSON.stringify(err));

								/** true for back navigation  and popup message*/
			this.service.showMessagePopup(true,this.strings.serverError);

			});

		}else{
			/**no network error message */
			this.service.showMessagePopup(true,this.strings.noNetwork);

		}

	}



	/**load more functionality to get more list */
	getMoreSlideListData(infinite){

		if( this.totalRows == this.utils.pageSize){
			this.getBannerListDetails(infinite);
		}else{
			infinite.enable(false);
		}


	}

	slideDetails(articleId){
		this.navCtrl.push(SlideDetailsPage, {articleId : articleId,pageFrom:"slideList"});
	}

  /** Back button functionality */
  goBack() {
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
