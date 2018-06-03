import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Content } from 'ionic-angular';
import {PolicySearchServiceProvider} from './policy-search-service';
import {UtilsProvider} from '../../../providers/utils/utils';
import {LoggerServiceProvider} from '../../../providers/logger-service/logger-service';
import {StringsProvider} from '../../../providers/strings/strings';
import {AdapterServiceProvider} from '../../../providers/adapter-service/adapter-service';
/**
 * Generated class for the PolicySearchResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-policy-search-results',
  templateUrl: 'policy-search-results.html',
})
export class PolicySearchResultsPage {

  searchData: any = [];
  pazeNum :number = 0;
  resultsResults:any = [ ];
  totalRows :number ;
  @ViewChild(Content) content;
  alignBottom: any = '';
	isLicenseUpdated : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private policySearchService: PolicySearchServiceProvider,
    private utils: UtilsProvider, private strings: StringsProvider,private  service:AdapterServiceProvider,
    private logger: LoggerServiceProvider) {

      this.searchData = navParams.get('searchData');

       this.getPolicySearchResults(undefined);
      this.pazeNum =0;

      // Event listener to udpate the height of events div
		window.addEventListener("orientationchange", () => {
      
            this.isLicenseUpdated = false;
            this.updateLicenseTextPosition();
      
          }, false);

  }

	/**LoadMore functionality to get more data:  */
	getMorePolicyData(infinite){
		if( this.totalRows == this.utils.pageSize){
			this.getPolicySearchResults(infinite);
		}else{
			infinite.enable(false);
		}
	}


	getPolicySearchResults(infinite){

  	if (this.utils.isDeviceOnLine()) {
    this.policySearchService.getPolicySearchData(this.searchData,this.pazeNum).then((res)=>{

      try{
        if(infinite != undefined)
			    infinite.complete();

        this.utils.hideLoader();
        this.logger.log("policySearchService success response"+JSON.stringify(res));
        if(res['responseJSON'] && res['responseJSON']['statusCode'] == 200 && res['responseJSON']['result'].toUpperCase()  == "SUCCESS"){
          /**Validating success */

          if(res['responseJSON']['datas'] && res['responseJSON']['datas'].length>0 ){
            /**Getting totalrows */
            this.totalRows =res['responseJSON']['totalRows'];

            this.resultsResults = this.resultsResults.concat(res['responseJSON']['datas']);
            this.pazeNum ++;

            this.updateLicenseTextPosition();

          }else{

            /** true for back navigation  and no data  message*/
            this.service.showMessagePopup(true,res['responseJSON']['message']);
          }
        }else{
         /**true: popup message and handling error */
         this.service.handlingErrorResponse(true,res);
        }
      }catch(e){

        this.logger.error("policySearchService catch error "+JSON.stringify(e));
      }

    },(err)=>{

      /** true for back navigation  and no server  message*/
      this.service.showMessagePopup(true,this.strings.serverError);

      if(infinite != undefined)
      infinite.complete();
      this.utils.hideLoader();
      this.logger.error("policySearchService failure "+JSON.stringify(err));

    });

  } else {
         /** true for back navigation  and no error  message*/
        this.service.showMessagePopup(true,this.strings.noNetwork);

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
