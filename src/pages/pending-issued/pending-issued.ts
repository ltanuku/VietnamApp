import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Content } from 'ionic-angular';
import { StringsProvider } from '../../providers/strings/strings';
import { AdapterServiceProvider } from "../../providers/adapter-service/adapter-service";
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
import { PolicyIssuedProvider } from '../pending-issued/policy-issued';
import { SearchDetailsPage } from '../search-details/search-details';
import { PolicyListProvider } from '../../pages/search-results/policy-list';
import { ConfigProvider } from '../../providers/config/config';
/**
 * Generated class for the PendingIssuedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-pending-issued',
	templateUrl: 'pending-issued.html',
})
export class PendingIssuedPage {

	pageNum: number = 0;
	totalrows: number;
	results: any = [];
	selectedPage: any = { "cardColor": "#658237" }
	@ViewChild(Content) content;
	alignBottom: any = '';
	selectedOption: any = "all";
	selectedDroupString: string = "";
	selectedLabel: string = "";
	isDropDownShow: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public strings: StringsProvider, public service: AdapterServiceProvider, private logger: LoggerServiceProvider, public policyIssuedService: PolicyIssuedProvider,
		public policyService: PolicyListProvider, public utils: UtilsProvider, public app: App, public config: ConfigProvider, ) {
		service.analytics("Pending Issued");

		this.updateLicenseTextPosition();
		// Event listener to udpate the height of events div
		window.addEventListener("orientationchange", () => {

			this.updateLicenseTextPosition();

		}, false);
	}

	ionViewDidEnter() {

		if (this.results.length == 0) {
			/** Calling policy Issued service */
			this.policyIssued(undefined);
		}
		this.selectedPage = { "selectedLabel": this.strings.waitingForAck, "pathKey": "waitingForAck", "cardColor": this.config.colorCodes.waitingForAckColor };
		this.selectedLabel = this.strings.waitingForAck;
		this.selectedDroupString = "waitingForAck";
	}

	/** dropdown show and hide */
	showHideDropDown() {

		this.isDropDownShow ? this.isDropDownShow = false : this.isDropDownShow = true;

	}
	/** selected option from dropdown */

	selectedValue(droupDownstring,val) {

		this.updateLicenseTextPosition();
		
		this.isDropDownShow = false;
		this.pageNum = 0;
		this.totalrows = 0;

		this.results = [];
		this.selectedDroupString = droupDownstring;
		this.selectedLabel = val;

		switch (val) {

			case this.strings.waitingForAck:
				this.selectedPage = { "selectedLabel": this.strings.waitingForAck,  "cardColor": this.config.colorCodes.waitingForAckColor };
				break;
			case this.strings.inGracePeriod:
				this.selectedPage = { "selectedLabel": this.strings.hd + " " + this.strings.inGracePeriod,  "cardColor": this.config.colorCodes.inGracePeriodColor };
				break;
			case this.strings.cancelGraceInPeriod:
				this.selectedPage = { "selectedLabel": this.strings.cancelPeriodCardTitle,  "cardColor": this.config.colorCodes.cancelGracePeriodColor };
				break;
			case this.strings.inPremiumPeriod:
				this.selectedPage = { "selectedLabel": this.strings.hd + " " + this.strings.inPremiumPeriod,  "cardColor": this.config.colorCodes.inPremiumPeriodColor };
				break;
			case this.strings.lapsed:
				this.selectedPage = { "selectedLabel": this.strings.hd + " " + this.strings.lapsed, "cardColor": this.config.colorCodes.lapsedColor };
				break;

			default:
				this.selectedPage = { "claimStatus": "true", "pathKey": "claimStatus", "cardColor": this.config.colorCodes.defaultColor };

		}
		this.policyIssued(undefined);
	}

	/** selectRadioButton */

	selectRadioButton() {

		this.updateLicenseTextPosition();

		if (this.selectedOption != "all") {

			/**when select second dropdown passing first selected text */
			this.selectedPage = { "selectedLabel": this.strings.waitingForAck,  "cardColor": this.config.colorCodes.waitingForAckColor };
			this.selectedLabel = this.strings.waitingForAck;
		} else {
			this.isDropDownShow = false;
		}
		this.pageNum = 0;
		this.totalrows = 0;
		this.results = [];
		this.policyIssued(undefined);

		
	}

	/** getting data from policy issued service */
	policyIssued(infinite) {
		if (this.utils.isDeviceOnLine()) {
			if (this.selectedOption != "all") {

				this.policyService.getPolicyList(this.pageNum, this.selectedDroupString).then((res) => {
					/** handling success response */
					this.policySuccesResponse(infinite, res);
				}, (err) => {
					/** true for back navigation  and server  message*/
					this.service.showMessagePopup(true, this.strings.serverError);
					if (infinite != undefined)
						infinite.complete();
					this.utils.hideLoader();
					this.logger.error("policy list failure " + JSON.stringify(err));
				});

			} else {
				this.policyIssuedService.getPolicyIssued(this.pageNum).then((res) => {

					/**Success response handling  */
					this.policySuccesResponse(infinite, res);

				}, (err) => {
					if (infinite != undefined)
						infinite.complete();
					this.utils.hideLoader();
					this.logger.error("policy issued failure " + JSON.stringify(err));

					/** false for disable backnavigation  and no server  message*/
					this.service.showMessagePopup(false, this.strings.serverError);
				});

			}

		}
		else {
			/** false for disable backnavigation  and no error  message*/
			this.service.showMessagePopup(false, this.strings.noNetwork);
		}

	}

	/**success**/
	policySuccesResponse(infinite, res) {

		try {
			if (infinite != undefined)
				infinite.complete();

			this.logger.log("search Result:" + res['responseJSON']);
			this.utils.hideLoader();

			/**validating success response */
			if (res['responseJSON'] && res['responseJSON']['statusCode'] == 200 && res['responseJSON']['result'].toUpperCase() == "SUCCESS") {

				/**checking results array available */
				if (res['responseJSON']['datas'] && res['responseJSON']['datas'].length > 0) {

					/**getting page number  */
					if (this.pageNum == 0)
						this.totalrows = res['responseJSON']['totalRows'];
					this.pageNum++;

					this.results = this.results.concat(res['responseJSON']['datas']);


					this.updateLicenseTextPosition();

				} else {
					if (infinite != undefined)
						infinite.enable(false);
					else {
						/**false for disable backnavigation  and no data  message*/
						this.service.showMessagePopup(false, res['responseJSON']['message']);

					}
				}
			} else {

				/**true: popup message and handling error */
				this.service.handlingErrorResponse(true, res);
			}
		} catch (err) {
			this.logger.error("policy issued catch error " + JSON.stringify(err));
		}

	}

	/** Load more data */
	getMorePolicyIssued(infinite) {
		if (this.totalrows == this.utils.pageSize) {
			this.policyIssued(infinite);
		} else {
			infinite.enable(false);
		}

	}


	/** Navigating to details screen */
	details(result) {
		let nav = this.app.getRootNav();
		let policyno;
		if(this.selectedOption == "all"){
			policyno = result.policyno;
		}else{

			if(this.selectedDroupString == "inPremiumPeriod" || this.selectedDroupString == "lapsed"){
				policyno = result.policyID;
			}else{
			/**	policyID for waitingForAck inGracePeriod cancelGracePeriod **/
				policyno = result.policyId;
			}

		}
		nav.push(SearchDetailsPage, { "policyNo": policyno, "issuedDetails": true, "color": this.selectedPage, "cardTitle": "CHỜ THẨM ĐỊNH" });
	}

	/** Calculate and set the position of the license text */
	updateLicenseTextPosition() {
		// Let the content update the scroll height
		setTimeout(() => {
			// Change the style to position : relative, to move the license below the content.
			if (this.content.getContentDimensions().scrollHeight > this.content.getContentDimensions().contentHeight) {
				this.alignBottom = this.utils.getLicenseTextStyles();
			} else {
				this.alignBottom = { 'position': 'absolute' };
			}
		}, 200);
	}
}
