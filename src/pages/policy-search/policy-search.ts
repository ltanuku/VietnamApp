import { UtilsProvider } from './../../providers/utils/utils';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import {StringsProvider} from '../../providers/strings/strings';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PolicySearchResultsPage} from './policy-search-results/policy-search-results';
import { Keyboard } from '@ionic-native/keyboard';
/**
 * Generated class for the PolicySearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-policy-search',
  templateUrl: 'policy-search.html',
})
export class PolicySearchPage {

  @ViewChild(Content) content: Content;
	alignBottom: any = '';
	isLicenseUpdated : boolean = false;

  policySearchForm:FormGroup;
  spajNum:any;
  policyNum:any;
  holderName:any;
  agentCode:any;
  agentName :any;
	isKeyboardHidden: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,private strings: StringsProvider, private fb: FormBuilder,	private keyboard: Keyboard, private utils: UtilsProvider) {

      this.policySearchForm = fb.group({
        'spajNum':['',[ Validators.pattern('[a-zA-Z0-9_]*')]],
        'policyNum':[''],
        'holderName':[''],
        'agentCode':['',[Validators.pattern('[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};,:\\\\|.<>\\/?]*')]],
        'agentName':[''],
      });

      this.spajNum = this.policySearchForm.controls['spajNum'];
      this.policyNum = this.policySearchForm.controls['policyNum'];
      this.holderName = this.policySearchForm.controls['holderName'];
      this.agentCode = this.policySearchForm.controls['agentCode'];
      this.agentName = this.policySearchForm.controls['agentName'];

      /** Hide footer on keyboard open */
      keyboard.onKeyboardShow().subscribe(() => {
        this.isKeyboardHidden = false;
        setTimeout(() => { // this to make sure that angular's cycle performed and the footer removed from the DOM before resizing
          this.content.resize();
        }, 200);
      });

      /** show footer on keyboard open */
      keyboard.onKeyboardHide().subscribe(() => {
        this.isKeyboardHidden = true;
        setTimeout(() => { // this to make sure that angular's cycle performed and the footer removed from the DOM before resizing
          this.content.resize();
        }, 200);
      });

      this.updateLicenseTextPosition();

      // Event listener to udpate the height of events div
		window.addEventListener("orientationchange", () => {
      
            this.isLicenseUpdated = false;
            this.updateLicenseTextPosition();
      
          }, false);
  }

  /**policy Search Submit */
  policySearchSubmit (form){
  /**checking form validation */
    if(form.valid){

      this.navCtrl.push(PolicySearchResultsPage,{searchData:form['value']});
    form.reset();

    }

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
