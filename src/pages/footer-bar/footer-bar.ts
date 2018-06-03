import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StringsProvider } from '../../providers/strings/strings';
import { PolicySearchPage } from '../policy-search/policy-search';
import { PolicyStatusPage } from '../policy-status/policy-status';

/**
 * Generated class for the FooterBarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'footer-bar',
  templateUrl: 'footer-bar.html'
})
export class FooterBarComponent {

	constructor(public strings: StringsProvider, public navCtrl: NavController) {
		
	}
	
	/** Navigating to policy status screen */
	policyStatus(){
		if (!(this.navCtrl.getActive().name == "PolicyStatusPage"))
			this.navCtrl.push(PolicyStatusPage);
	}
	
	/** Navigating to policy search screen */
	policySearch(){
		if (!(this.navCtrl.getActive().name == "PolicySearchPage"))
			this.navCtrl.push(PolicySearchPage);
	}

}
