import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { StringsProvider } from '../../providers/strings/strings';
import { SunElitePagePersonal } from './sun-elite-personal/sun-elite-personal';
import { SunElitePageUnit } from './sun-elite-unit/sun-elite-unit';
import { SunElitePageBranch } from './sun-elite-branch/sun-elite-branch';
/**
 * Generated class for the SunElitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sun-elite',
  templateUrl: 'sun-elite.html',
})
export class SunElitePage {

  @ViewChild(Navbar) navBar: Navbar;

	constructor(public navCtrl: NavController, public navParams: NavParams,public strings: StringsProvider) {

	}

	ionViewDidLoad() {

	}

  /** Back button functionality */
	goBack ()  {
		// Disable back animation, as pages with tabs gives white screen in iPhone
		this.navCtrl.pop({ animate: false });
	}

	tab1Root = SunElitePagePersonal;
	tab2Root = SunElitePageUnit;
	tab3Root = SunElitePageBranch;

}
