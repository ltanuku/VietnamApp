import { Component, ViewChild, Renderer2 } from '@angular/core';
import { NavController, Platform, AlertController, MenuController , ModalController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { ChangepasswordPage } from "../pages/changepassword/changepassword";
import { JsonStoreProvider } from "../providers/json-store/json-store";
import { AdapterServiceProvider } from "../providers/adapter-service/adapter-service";
import { ConfigProvider } from "../providers/config/config";
import { PasscodeLoginPage } from "../pages/passcode-login/passcode-login";
import { SearchResultsPage } from "../pages/search-results/search-results";
import { StringsProvider } from '../providers/strings/strings';
import { AuthHandlerProvider } from '../providers/auth-handler/auth-handler'
import { UtilsProvider } from '../providers/utils/utils';
import { LoggerServiceProvider } from '../providers/logger-service/logger-service';
import { ProfilePage } from '../pages/profile/profile';
import { PendingUnderWritingPage } from "../pages/pending-underwriting/pending-underwriting";
import { PolicySearchPage } from '../pages/policy-search/policy-search';
import { Subscription } from 'rxjs/Subscription';
import { Keyboard } from '@ionic-native/keyboard';
import { popupPage } from '../pages/popup/popup.component';

declare var WLAuthorizationManager;

@Component({
	templateUrl: 'app.html'
})
export class MyApp {

	@ViewChild('content') navCtrl: NavController;

	rootPage: any;
	isSearchTap: boolean;
	isSubSearch: boolean;
	isPremiumSearch: string = 'inactive';
	profilePic: any;

	isMFPJsonLoaded = false;

	constructor(private app: App,public authHanler: AuthHandlerProvider, public render: Renderer2, platform: Platform, statusBar: StatusBar, public splashScreen: SplashScreen, public jsonStore: JsonStoreProvider, private service: AdapterServiceProvider,
		private logger: LoggerServiceProvider, private config: ConfigProvider, public strings: StringsProvider, private utility: UtilsProvider, public alertCtrl: AlertController, public menuCtrl: MenuController, private keyboard: Keyboard , public modalCtrl: ModalController) {

		this.render.listen('document', 'mfpjsloaded', () => {
			// this.jsonstore.initilizeJsonStore();
			this.authHanler.authInit();

			/* WLAuthorizationManager.obtainAccessToken().then(
				(accessToken) => {
				  this.logger.log(">> Success - Connected to MobileFirst Server");
				},
				(error) => {
					this.logger.log(">> Failed to connect to MobileFirst Server");
					this.logger.log(error);
				}
			); */
		});

		this.render.listen('document', 'mfpjsonjsloaded', () => {


			if (this.utility.isDevice()) {
				this.config.userInfo.deviceID = this.utility.getDeviceId();

				/** Initilize the JSONStore userDetails **/
				statusBar.styleDefault();

				this.jsonStore.initilizeJsonUserDetails().then(() => {
					this.logger.log("JSONStore userdetails initilize successfull");
					// MfpJsonLoaded call back is called twice in Android. To avoid this.
					if (this.isMFPJsonLoaded) {
						return;
					}
					this.isMFPJsonLoaded = true;
					this.jsonStore.getJsonStoreData(this.jsonStore.collectionNames.userDetails).then((res: any = []) => {
						if (res[0]) {
							this.config.userInfo.userID = res[0]['json']['id'];
							this.config.userInfo.token = res[0]['json']['token'];
							this.config.userInfo.agentCode = res[0]['json']['agentCode'];
							this.config.userInfo.userType = res[0]['json']['agentType'];
							splashScreen.hide();
							this.navCtrl.setRoot(PasscodeLoginPage);
						} else {
							this.loadLoginPage();
						}
					}, (err) => {
						this.loadLoginPage();
						this.logger.error("JSON Store userDetails getData fail:" + JSON.stringify(err));

					});
				}, (err) => {
					this.loadLoginPage();
					this.logger.error("JSONStore userDetails initilize fail:" + JSON.stringify(err));

				});
			} else {
				/**for web  rootpage is login */
				this.loadLoginPage();
			}


		});

		this.config.userInfo.sessionId = this.utility.getSessionId();

		this.config.userInfo.userPic = "./assets/icon/profilepic.jpg";
		this.profilePic = { 'background': 'url("' + this.config.userInfo.userPic + '")', 'background-size': 'cover' };
		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.


			keyboard.hideKeyboardAccessoryBar(true);
			keyboard.disableScroll(true);

			/** getting jsonstore data to display login and passcode  **/
			if (!this.utility.isDevice()) {
				this.navCtrl.setRoot(LoginPage);
			}

			/**Device back button handling */
			platform.registerBackButtonAction(() => {

				/** if alert popups open  restrect them */
				if (this.service.hasPopupOpen)
					return false;

				/** closong menuctrl if it is open  */

				if (this.menuCtrl.isOpen()) {
					this.menuCtrl.close();
				}
				else if (this.navCtrl.getActive().name == "HomePage" || this.navCtrl.getActive().name == "PasscodeRegPage" || this.navCtrl.getActive().name == "PasscodeLoginPage" || this.navCtrl.getActive().name == "LoginPage") {

					let title = this.strings.doYouWantExit;
					let confirmState = "exit";
					let myModal = this.modalCtrl.create(popupPage,{title : title , confirmState : confirmState, enableBackdropDismiss: false});
					myModal.onDidDismiss(data => {

					});
					myModal.present();

				} else {
					//if(this.loginIDItem.nativeElement.classList.contains('item-input-has-focus'))
					if(!this.app._appRoot._elementRef.nativeElement.childNodes[5].classList.contains('loading-md'))
						this.navCtrl.pop();

				}

			});

		});
	}

	loadLoginPage() {
		setTimeout(() => {
			this.splashScreen.hide();
		}, 250);
		this.navCtrl.setRoot(LoginPage);
	}

	/** menu close  */
	menuClosed() {
		this.isPremiumSearch = 'inactive';
	}

	premiumSearchTap() {
		this.isPremiumSearch == 'active' ? this.isPremiumSearch = 'inactive' : this.isPremiumSearch = 'active';
	}

	/** Logout */
	logout() {
		/* if (!this.utility.isDevice()) {
			this.service.confirmPopup(false, this.strings.doYouSignout, () => {
				this.navCtrl.setRoot(LoginPage);

			});
		}
		this.config.userInfo.sessionId = this.utility.getSessionId(); */
		let title = this.strings.doYouSignout;
		let confirmState = "logout";
		let myModal = this.modalCtrl.create(popupPage,{title : title,confirmState: confirmState, enableBackdropDismiss: false});
		myModal.onDidDismiss(data => {

		});
		myModal.present();
	}

	/** Search Results screen */
	searchResults(screen) {
		this.navCtrl.push(SearchResultsPage, { "page": screen });
	}

	/** Navigating to Home Screen */
	home() {
		if (!(this.navCtrl.getActive().name == "HomePage"))
			//this.navCtrl.setRoot(HomePage);
			this.navCtrl.popToRoot({ animate: false });
	}

	/** Navigating to Underwriting Screen */
	underwriting() {
		this.navCtrl.push(PendingUnderWritingPage, { "sideMenuUnderwriting": true });
	}

	/** navigating to Profile Screen */
	profile() {
		this.navCtrl.push(ProfilePage);
	}

	/** Policy Search */
	policySearch() {
		this.navCtrl.push(PolicySearchPage);
	}

	/**page enter events */
	ionViewDidEnter() {

	}

}
