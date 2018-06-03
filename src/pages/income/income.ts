import { IncomeDetailsPage } from './../income-details/income-details';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { StringsProvider } from '../../providers/strings/strings';
import { IncomeServiceProvider } from './income-service';
import { UtilsProvider } from '../../providers/utils/utils';
import { AdapterServiceProvider } from '../../providers/adapter-service/adapter-service';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
/**
 * Generated class for the IncomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-income',
  templateUrl: 'income.html',
})
export class IncomePage {

  @ViewChild(Content) content;
  alignBottom: any = '';
  isLicenseUpdated: boolean = false;

  pazenum: number = 0;
  totalRows: number;
  incomeResult: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private strings: StringsProvider, private logger: LoggerServiceProvider
    , private utils: UtilsProvider, private incomeService: IncomeServiceProvider, private service: AdapterServiceProvider,
  ) {

    /**Getting income list data */
    this.getIncomeListData(undefined);

    		// Event listener to udpate the height of events div
		window.addEventListener("orientationchange", () => {
			
						this.isLicenseUpdated = false;
						this.updateLicenseTextPosition();
			
					}, false);

  }


  /**Load more functionality */
  getMoreIncomeData(infinite) {

    if (this.totalRows == this.utils.pageSize) {
      this.getIncomeListData(infinite);
    } else {
      infinite.enable(false);
    }

  }


  getIncomeListData(infinite) {

    this.incomeService.getIncomeData(this.pazenum).then((res) => {

      if (this.utils.isDeviceOnLine()) {
        try {
          if (infinite != undefined)
            infinite.complete();
          else
            this.utils.hideLoader();
          this.logger.log("incomeService success:" + JSON.stringify(res['responseJSON']));
          if (res['responseJSON'] && res['responseJSON']['statusCode'] == 200 && res['responseJSON']['result'].toUpperCase() == "SUCCESS") {

            /**catch the calendar month events */
            if (res['responseJSON']['datas'].length > 0) {
              this.incomeResult = this.incomeResult.concat(res['responseJSON']['datas']);
              this.totalRows = res['responseJSON']['totalRows'];

              this.pazenum++;

              
						this.updateLicenseTextPosition();
            }
            else {
              if (infinite != undefined)
                infinite.enable(false);
              else
                this.service.showMessagePopup(true, res['responseJSON']['message']);
            }
          } else {
            /**true: popup message and handling error */
            this.service.handlingErrorResponse(true, res);
          }
        } catch (e) {
          this.logger.error("incomeService catch error:" + JSON.stringify(e));
        }

      } else {
        /**network error */
        this.service.showMessagePopup(true, this.strings.noNetwork);
      }

    }, (err) => {

      if (infinite != undefined) {
        infinite.complete();
        this.utils.showToastMsg(this.strings.serverError);
      } else {
        this.service.showMessagePopup(true, this.strings.serverError);
        this.utils.hideLoader();
      }


      this.logger.error("Income List Data fail :" + JSON.stringify(err));
      /**dispaying  error popup */

    });


  }


  /* showing data failure message and server failure message **/
  showErrorPopUp(message) {

    this.utils.showMessage("", message, [{
      text: this.strings.popUpOk,
      handler: () => {
        this.navCtrl.pop();
      }
    }]);

  }
  
  /** Back button functionality */
  goBack() {
    this.navCtrl.pop();
  }

  openIncomeDetails(incomeId) {
    this.navCtrl.push(IncomeDetailsPage, { "IncomeId": incomeId });
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
