import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, MenuController, Content } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

/** Providers */
import { HomeServiceProvider } from './home-service';
import { AdapterServiceProvider } from "../../providers/adapter-service/adapter-service";
import { JsonStoreProvider } from "../../providers/json-store/json-store";
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { FileStorageProvider } from '../../providers/file-storage/file-storage';
import { IndividualPerformancePage } from '../individual-performance/individual-performance';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
import { ConfigProvider } from '../../providers/config/config';

/** Pages */
import { PolicySearchPage } from '../policy-search/policy-search';
import { CalendarPage } from "../calendar/calendar";
import { SlideDetailsPage } from "../slide-details/slide-details";
import { PolicyStatusPage } from '../policy-status/policy-status';
import { MdrtPage } from '../mdrt/mdrt';
import { IncomePage } from '../../pages/income/income';
import { SunElitePage } from '../../pages/sun-elite/sun-elite';
import { GroupPerformancePage } from '../../pages/group-performance/group-performance';
import { FullyearReportPage } from '../../pages/fullyear-report/fullyear-report';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	/** Get slides */
	@ViewChild(Slides) slides: Slides;
	@ViewChild(Content) content;

	alignBottom: any = '';

	teamPerformanceCss: any;
	noScroll: boolean = false;

	hasSlideLoad = false;
	slideData: any = [];
	//slideData: any = [{ "imageDetail": "./assets/icon/slide-01.jpg","articleId":3 }];
	pages = [];
	 width :any ;
	 height :any ;
	 lastUpdatedBannerImage: any = 100000;
	 lastUpdatedUserImage:any = 100000;
	constructor(public navCtrl: NavController, private service: AdapterServiceProvider, private jsonStore: JsonStoreProvider,
		public strings: StringsProvider, private utils: UtilsProvider, public fileStorage: FileStorageProvider,
		private logger: LoggerServiceProvider, public domSanitizer: DomSanitizer, public config: ConfigProvider, private homeServiceProvider: HomeServiceProvider, private menu: MenuController) {
		service.analytics("Dashboard");

		/** Report pages  */

		this.pages = [

			{ title: 'individual', component: IndividualPerformancePage },
			{ title: 'group', component: GroupPerformancePage },
			{ title: 'MDRT', component: MdrtPage },
			{ title: 'SunElite', component: SunElitePage },
			{ title: 'Fullyear', component: FullyearReportPage }
		];
		this.width = this.utils.getDeviceWidth();
		this.height =  this.utils.getDeviceWidth();

	
		// Event listener to udpate the height of events div
		window.addEventListener("orientationchange", () => {

			this.updateLicenseTextPosition();

		}, false);
		

	}

	/**pull to refresh */
	doRefresh(refresher){
			/** passing last update date width , height and  a flag to indicate service hit from pull to refresh */
		this.homeServiceProvider.getHomePage(this.width, this.height, this.lastUpdatedBannerImage, this.lastUpdatedUserImage,true).then((res) => {
			/**succes callback */
			this.handlinglandingSuccessResponse(res);
			refresher.complete();
		}, (err) => {
			/**Failure  */
			refresher.complete();
			this.utils.showToastMsg(this.strings.serverError);
			/** Hide scroll when loader displayed */
			this.noScroll = false;
		});
			
	}
	/**page enter events */
	ionViewDidEnter() {
		/**start playing images when enter to the view */
		if (this.slides && this.slideData.length > 1) {
			this.slides.autoplay = 2000;
			//this.slides.resize();
			this.slides.startAutoplay();
		}

		this.menu.swipeEnable(true);

	}

	/** Page Leave event**/
	ionViewDidLeave() {
		/**stop playing images when leave the view */
		if (this.slides) {
			this.slides.stopAutoplay();
		}

		this.menu.swipeEnable(false);

	}

	/** get home page data */
	ionViewDidLoad() {

		/** Disable the TeamProduction if the login user is Agent*/
		if (this.config.userInfo.userType == "AG") {
			this.teamPerformanceCss = { 'opacity': '.5', 'pointer-events': 'none' };

		}

		this.updateLicenseTextPosition();
		
		/** Enable auto play after user interaction */
		//this.slides.autoplayDisableOnInteraction = false;

		/** initilize banner imagejson store   **/
		if (this.utils.isDevice()) {

			/**Initilizing banner image JSONStore */
			this.jsonStore.initializeJsonStoreBannerImages().then((res) => {
				this.logger.log("Json banner images collection initilized");
				this.jsonStore.getJsonStoreData(this.jsonStore.collectionNames.imageDetails).then((res) => {
					if (res[0]) {

						/**Getting userimage and bannerimage update date */
						this.lastUpdatedBannerImage = 100000;//res[0]['json']['bannerImgUdate'];
						this.lastUpdatedUserImage = res[0]['json']['userPicUdate'];

						this.fileStorage.createStorageDirectory(res[0]['json']['bannerImges']).then((dirEntry) => {

							/** read file from storage directory */
							this.fileStorage.readFileFromDirectory(dirEntry).then((file) => {
								var reader = new FileReader();
								reader.onloadend = (evt) => {

									//	this.slideData  =[];
									/** get the base64 image string from file **/
									//	setTimeout(()=>{
									this.slideData = JSON.parse(evt.target['result']);
									this.hasSlideLoad = true;
									setTimeout(() => {
										if (this.slides && this.slideData.length > 1) {
											this.slides.autoplayDisableOnInteraction = false;
											this.slides.resize();
										}
									}, 1000);

									this.logger.log(JSON.parse(evt.target['result']));
									
									this.homeServiceProvider.getHomePage(this.width, this.height, this.lastUpdatedBannerImage, this.lastUpdatedUserImage,false).then((res) => {
										this.handlinglandingSuccessResponse(res);
									}, (err) => {
										this.utils.hideLoader();
										this.utils.showToastMsg(this.strings.serverError);
										/** Hide scroll when loader displayed */
										this.noScroll = false;
									});
								};
								reader.onerror = (e) => {
									this.logger.error("file read error" + JSON.stringify(e));
								}
								reader.readAsText(file);

							}, (err) => {
								this.logger.error("Read file Path Error" + JSON.stringify(err));
							});

						}, (err) => {
							this.logger.error("getJsonStoreData: " + JSON.stringify(err));
						});

					} else {
						this.homeServiceProvider.getHomePage(this.width, this.height, this.lastUpdatedBannerImage, this.lastUpdatedUserImage,false).then((res) => {
							this.handlinglandingSuccessResponse(res);
						}, (err) => {
							this.utils.hideLoader();
							this.utils.showToastMsg(this.strings.serverError);
							/** Hide scroll when loader displayed */
							this.noScroll = false;
						});

					}
				}, (err) => {
					this.logger.error(err);
				});

			}, (err) => {
				this.logger.error("json banner image init")
			});
			/** end of */

		} else {
			this.homeServiceProvider.getHomePage(this.width, this.height, this.lastUpdatedBannerImage, this.lastUpdatedUserImage,false).then((res) => {
				this.handlinglandingSuccessResponse(res);
			}, (err) => {
				this.utils.hideLoader();

				/** Hide scroll when loader displayed */
				this.noScroll = false;

				this.utils.showToastMsg(this.strings.serverError);
			});
		}

	}


	/** */
	handlinglandingSuccessResponse(res) {
		try {
			this.utils.hideLoader();
			this.noScroll = false;
			if (res['responseJSON'] && res['responseJSON']['statusCode'] == 200) {

				if (res['responseJSON']['result'] && res['responseJSON']['result'].toUpperCase() == "SUCCESS") {
					let isImageUpdate = false;
					if (res['responseJSON']['bannerImages'].length > 0) {
						let data = res['responseJSON']['bannerImages'];
						let isImageUpdate = true;
						this.hasSlideLoad = true;
						/** adding data image to base64 string for each and every banner image */
						for (let i = 0; i < data.length; i++) {
							data[i]['imageDetail'] = "data:image/jpeg;base64, " + data[i]['imageDetail'];

						}
						/** checking userImage is available */
						if (res['responseJSON']['userPicture'])
							isImageUpdate = true;

							this.slideData = data;
						setTimeout(() => {
							if (this.slides && this.slideData.length > 1) {
								this.slides.autoplayDisableOnInteraction = false;
							}
						}, 1000);

						/** writing  the bannner images into file and storing the file into JSONSTORE */
						if (this.utils.isDevice() && isImageUpdate) {

							/**getting application storage, it is diferent for android and ios */
							this.fileStorage.createStorageDirectory(this.fileStorage.getStorageType()).then((fileSystem) => {
								this.fileStorage.createDirectoryNotExists(fileSystem).then((dirEntry) => {

									/**Getting directory instance  */
									this.fileStorage.createFileNotExists(dirEntry).then((fileEntry) => {

										/** getting file path by passing file name */
										fileEntry.createWriter((fileWriter) => {

											/**starting cursor postion at 0 position  */
											fileWriter.seek(0);

											/** once file write end  */
											fileWriter.onwriteend = () => {

												/*** storing data like bannerImages, Userpic, lastUpdated banner and userPic  into json Store */
												this.jsonStore.addDataToJsonStore(this.jsonStore.collectionNames.imageDetails,
													{
														bannerImges: fileWriter['localURL'],
														userPic: res['responseJSON']['userPicture'],
														bannerImgUdate: res['responseJSON']['lastUpdatedBannerImage'],
														userPicUdate: res['responseJSON']['lastUpdatedUserImage'],

													}
												);

											}

											/** file write error */
											fileWriter.onerror = function (e) {
												this.logger.error("File writing error" + JSON.stringify(e));
											};
											/** writing bannerImage into file */
											fileWriter.write(JSON.stringify(this.slideData));

										}, (err) => {
											this.logger.error("file enter Error:" + JSON.stringify(err));
										});

									}, (err) => {
										this.logger.error("file creationtion error:" + JSON.stringify(err));
									});

								}, (err) => {
									this.logger.error("create a directory " + JSON.stringify(err));
								});

							}, (err) => {
								this.logger.error("createStorageDirectory error:" + JSON.stringify(err));
							});
						}

					}

				} else {
					this.logger.log(res['responseJSON']['message']);
					this.utils.showToastMsg(res['responseJSON']['message']);
				}
			} else {
				/**false: showing toast message  */
				this.service.handlingErrorResponse(false, res);
			}

		} catch (e) {
			this.logger.log("LandingPage Catch error:" + JSON.parse(e));
		}

	}

	/** navigate to calendar **/
	calendar() {
		this.navCtrl.push(CalendarPage);
	}

	/* Navigate to slide details screen */
	slideDetail() {
		
		if(this.slides.clickedIndex != undefined){
			let slideImg = this.slides._slides[this.slides.clickedIndex].getAttribute('data-swiper-slide-index');
			if (slideImg != undefined && this.slideData.length > 0) {
			 this.navCtrl.push(SlideDetailsPage, { articleId: this.slideData[slideImg].articleId, pageFrom: "homePage" });
			}
		  
		   }
		}	
		 
	/** individual performance */
	productionReport(pageNum) {

		/**If the angent tree list is empty getting dropDown user list by passing usertype */
		if (this.config.userInfo.agentsList == null || this.config.userInfo.agentsList.length == 0) {

			let userType = "LEADER";
			if (this.config.userInfo.userType == "AG")
				userType = "AGENT";
			this.homeServiceProvider.getAgentsDropDownList(userType).then((res) => {

				try {
					this.utils.hideLoader();

					/** Hide scroll when loader displayed */
					this.noScroll = false;

					this.logger.log("getBannerListDetails sucess response" + JSON.stringify(res));
					if (res['responseJSON'] && res['responseJSON']['statusCode'] == 200 && res['responseJSON']['result'].toUpperCase() == "SUCCESS") {
						/**Validating success */

						this.config.userInfo.agentsList = res['responseJSON']['agents'];
						//this.slideDetails = res['responseJSON'];
						if (res['responseJSON']['agents'] && res['responseJSON']['agents'].length > 0) {

							this.config.userInfo.agentsList = res['responseJSON']['agents'];
						}

						else
							this.utils.showToastMsg(res['responseJSON']['message']);

						this.navCtrl.push(this.pages[pageNum].component);

					}
					else {
						/** Handling error response,,false: showing toast message  */
						this.service.handlingErrorResponse(false, res);
					}
				} catch (e) {
					this.logger.error("Agent Tree catch error " + JSON.stringify(e));
				}

			}, (err) => {
				this.utils.showToastMsg(this.strings.serverError);
				this.utils.hideLoader();
				this.navCtrl.push(this.pages[pageNum].component);
				/** Hide scroll when loader displayed */
				this.noScroll = false;
			});

		} else {
			this.navCtrl.push(this.pages[pageNum].component);
			//this.navCtrl.push(appNavigation);
		}

	}

	/** Navigate to policy status screen */
	policyStatus() {
		this.navCtrl.push(PolicyStatusPage, {}, { animate: false });
	}

	/** Policy Search */
	policySearch() {
		this.navCtrl.push(PolicySearchPage);
	}

	/**Income page navigation */
	incomPage() {

		this.navCtrl.push(IncomePage);

	}

	/** Calculate and set the position of the license text */
	updateLicenseTextPosition(){
			// Let the content update the scroll height
			setTimeout(() => {
				// Change the style to position : relative, to move the license below the content.
				if (this.content.getContentDimensions().scrollHeight > this.content.getContentDimensions().contentHeight) {
					this.alignBottom = this.utils.getLicenseTextStyles();
				}else{
					this.alignBottom = { 'position': 'absolute' };
				}
			}, 200);
	}
}
