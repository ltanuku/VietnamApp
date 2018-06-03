import { ConfigProvider } from './../../providers/config/config';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, App, Content } from 'ionic-angular';
import { StringsProvider } from '../../providers/strings/strings';
import { AdapterServiceProvider } from "../../providers/adapter-service/adapter-service";
import { UtilsProvider } from '../../providers/utils/utils';
import { UnderwritingProvider } from '../pending-underwriting/underwriting';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
import { SearchDetailsPage } from '../search-details/search-details';

@Component({
	selector: 'page-pending-underwriting',
	templateUrl: 'pending-underwriting.html'
})
export class PendingUnderWritingPage {


	pageNum: number = 0;
	totalrows: number;
	results: any = [];
	sideMenu: any;
	selectedPage: any = { "cardColor": "#5482ab" }
	@ViewChild(Content) content;
	alignBottom: any = '';
	isLicenseUpdated : boolean = false;

	constructor(public navCtrl: NavController, public strings: StringsProvider, public utils: UtilsProvider, public underwriting: UnderwritingProvider,
		private logger: LoggerServiceProvider, public service: AdapterServiceProvider, public navParams: NavParams, public app: App,
		public config: ConfigProvider) {

		service.analytics("Pending Underwriting");

		this.sideMenu = navParams.get("sideMenuUnderwriting");

		// Event listener to udpate the height of events div
		window.addEventListener("orientationchange", () => {

			this.isLicenseUpdated = false;
			this.updateLicenseTextPosition();

		}, false);
	}

	ionViewDidEnter() {

		if (this.results.length == 0) {
			/** calling service pending underwriting */
			this.policyUnderwriting(undefined);
		}

	}

	/** pending underwriting service */
	policyUnderwriting(infinite) {

		if (this.utils.isDeviceOnLine()) {

			this.underwriting.getUnderwriting(this.pageNum).then((res) => {
				try {
					if (infinite != undefined)
						infinite.complete();

					this.logger.log("search Result:" + res['responseJSON']);
					this.utils.hideLoader();

					/**validating success response */
					if (res['responseJSON'] && res['responseJSON']['statusCode'] == 200 && res['responseJSON']['result'].toUpperCase() == "SUCCESS") {

						/**checking results array available */
						if (res['responseJSON']['pulist'] && res['responseJSON']['pulist'].length > 0) {

							/**getting page number  */
							this.totalrows = res['responseJSON']['totalRows'];
							this.pageNum++;

							this.results = this.results.concat(res['responseJSON']['pulist']);


							this.updateLicenseTextPosition();

						} else {
							if (infinite != undefined)
								infinite.enable(false);
							/**display error message  this.sideMenu*/
							this.showErrorMessagePopup(res['responseJSON']['message']);


						}
					} else {

						/**true: popup message and handling error */
						this.service.handlingErrorResponse(true,res);
					}
				} catch (err) {
					this.logger.error("policy Underwriting catch error " + JSON.stringify(err));
				}

			}, (err) => {
				if (infinite != undefined)
					infinite.complete();
				//this.utils.hideLoader();
				this.logger.error("policy Underwriting failure " + JSON.stringify(err));
				this.showErrorMessagePopup(this.strings.serverError);
			});
		} else {
			/**no network */
			this.showErrorMessagePopup(this.strings.noNetwork);
		}

	}

	/** Load more data */
	getMoreUnderwriting(infinite) {
		if (this.totalrows == this.utils.pageSize) {
			this.policyUnderwriting(infinite);
		} else {
			infinite.enable(false);
		}
	}

	showErrorMessagePopup(message) {

		if(this.sideMenu)
			this.service.showMessagePopup(true,this.strings.serverError);
		else
			this.service.showMessagePopup(false,this.strings.serverError);

	}

	/** Back button functionality */
	goBack ()  {
		this.navCtrl.pop();
	}
	/** Navigating to details screen */
	details(policyno) {
		let nav = this.app.getRootNav();
		nav.push(SearchDetailsPage, { "policyNo": policyno, "underwriting": true, "color": this.selectedPage });
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
