import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { StringsProvider } from '../../providers/strings/strings';
import { FullYearPersonalPage } from './full-year-personal/full-year-personal';
import { FullYearUnitPage } from './full-year-unit/full-year-unit';
import { FullYearBranchPage } from './full-year-branch/full-year-branch';

/**
 * Generated class for the FullyearReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fullyear-report',
  templateUrl: 'fullyear-report.html',
})
export class FullyearReportPage {

	@ViewChild(Navbar) navBar: Navbar;

	constructor(public navCtrl: NavController, public navParams: NavParams,public strings: StringsProvider) {

	}

	/** Back button functionality */
	goBack ()  {
		// Disable back animation, as pages with tabs gives white screen in iPhone
		this.navCtrl.pop({ animate: false });
	}

	tab1Root = FullYearPersonalPage;
	tab2Root = FullYearUnitPage;
	tab3Root = FullYearBranchPage;

}
