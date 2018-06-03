import { StringsProvider } from './../../providers/strings/strings';
import { AdapterServiceProvider } from './../../providers/adapter-service/adapter-service';
import { UtilsProvider } from './../../providers/utils/utils';
import { LoggerServiceProvider } from './../../providers/logger-service/logger-service';
import { IncomeDetailsServiceProvider } from './income-details-service';
import { Component ,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Content} from 'ionic-angular';

/**
 * Generated class for the IncomeDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-income-details',
  templateUrl: 'income-details.html',
})
export class IncomeDetailsPage {

@ViewChild(Content) content;
	alignBottom: any = '';
	isLicenseUpdated : boolean = false;
  pdfSrc : any;
  fontZoom :number=1;
  constructor(public navCtrl: NavController, public navParams: NavParams, public detailsService : IncomeDetailsServiceProvider,
    private logger : LoggerServiceProvider, private utils: UtilsProvider, private  service: AdapterServiceProvider, private strings:StringsProvider) {

      let incomeId = navParams.get("IncomeId");

      this.getIncomeDetails(incomeId);

  }


/**Income details */
getIncomeDetails(incomeID){

      this.detailsService.getIncomeDataDetail(incomeID).then((res)=>{

        if(this.utils.isDeviceOnLine()){
          try{

            this.logger.log("detailsService success:"+JSON.stringify(res['responseJSON']));
            if (res['responseJSON'] && res['responseJSON']['statusCode'] == 200 && res['responseJSON']['result'].toUpperCase() == "SUCCESS") {

              this.pdfSrc = "data:application/pdf;base64," +res['responseJSON']['content'];


              if (!this.isLicenseUpdated) {
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
              /**true: popup message and handling error */
            this.service.handlingErrorResponse(true,res);
            }
          }catch(e){
            this.logger.error("income details catch error: "+JSON.stringify(e));
          }
        }else{

          this.utils.showToastMsg(this.strings.noNetwork);
        }

      },(err)=>{
        this.logger.error("income details fail: "+JSON.stringify(err));
        /**server error */
        this.showErrorPopUp(this.strings.serverError);
        this.utils.hideLoader();
      });


    }

    	/* showing data failure message and server failure message **/
		showErrorPopUp(message){

          this.utils.showMessage("",message,[{
            text:this.strings.popUpOk,
            handler:()=>{
                  this.navCtrl.pop();
              }
            }]);

      }
/**pdf Load Complete */
pdfLoadComplete($event){

  this.utils.hideLoader();

}
    onLoadError(error: any){
        this.utils.showMessage("", "" + this.strings.incomeDetailsLoadError, [{
            'text' : 'OK',
            'handler' : () => {
              this.navCtrl.pop();
            }
        }]);
    }

    /** back button navigation */
    goBack(){
        this.navCtrl.pop();
    }

    /**zoom out PDF */
    increaseZoom(){
      if(this.fontZoom<3){
        this.fontZoom = this.fontZoom+0.5;
        if (!this.isLicenseUpdated) {
          // Let the content update the scroll height
          setTimeout(() => {
            // Change the style to position : relative, to move the license below the content.
            if (this.content.getContentDimensions().scrollHeight > this.content.getContentDimensions().contentHeight) {
              this.alignBottom = this.utils.getLicenseTextStyles();

              this.isLicenseUpdated = true;
            }
          }, 200);
        }
      }


    }
    /**zoom In PDF */
    decreaseZoom(){
      if(this.fontZoom > 1)
      this.fontZoom = this.fontZoom-0.5;
    }



}
