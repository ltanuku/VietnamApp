import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar} from 'ionic-angular';
import { PendingUnderWritingPage } from "../pending-underwriting/pending-underwriting";
import { PendingIssuedPage } from "../pending-issued/pending-issued";
import { PolicyIssuedProvider } from '../pending-issued/policy-issued';
import { SearchDetailsPage } from '../search-details/search-details';
import { StringsProvider } from '../../providers/strings/strings';
/**
 * Generated class for the PolicyStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-policy-status',
	templateUrl: 'policy-status.html',
})
export class PolicyStatusPage {

	@ViewChild(Navbar) navBar: Navbar;
	constructor(public navCtrl: NavController, public navParams: NavParams, public strings: StringsProvider) {

	}

	/** Back button functionality */
	goBack ()  {
		// Disable back animation, as pages with tabs gives white screen in iPhone
		this.navCtrl.pop({ animate: false });
	}
	tab1Root = PendingUnderWritingPage;
	tab2Root = PendingIssuedPage;

}
