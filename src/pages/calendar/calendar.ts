import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content,MenuController } from 'ionic-angular';
import { CalendarEventTimesChangedEvent, CalendarDateFormatter } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service'
import { ConfigProvider } from '../../providers/config/config';
import { CustomDateFormatterProvider } from '../../providers/custom-date-formatter/custom-date-formatter';
import { AdapterServiceProvider } from "../../providers/adapter-service/adapter-service";
import { UtilsProvider } from '../../providers/utils/utils';
import { StringsProvider } from '../../providers/strings/strings';

import { IctToLocal } from '../../pipes/date-format/date-format';
import {CalendarServiceProvider} from './calendar-service'
/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'mwl-demo-component',
	templateUrl: 'calendar.html',
	providers: [
		{
			provide: CalendarDateFormatter,
			useClass: CustomDateFormatterProvider
		}
	]
})
export class CalendarPage {

	/** Get current displaying month and year */
	@ViewChild('currentMonth') currentMonth: ElementRef;
	@ViewChild('currentYear') currentYear: ElementRef;
	@ViewChild(Content) content;
	@ViewChild('calendarDiv') calendarDiv;
	@ViewChild('eventsDiv') eventsDiv;
	@ViewChild('eventContent') eventContent;
	
	eventsHeight : any ;

	yearModified: any = '';
	monthModified: any = '';
	data: any;
	monthNum: any;
	calendarPeriod: any;
	isEvents: boolean = false;
	view: string = 'month';
	viewDate: Date = new Date();
	alignBottom: any = '';
	isLicenseUpdated : boolean = false;
	datePipe: any;
	customEvent: any = [];
	months = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
	monthSelected = this.months[new Date().getMonth()];
	yearSelected = new Date().getFullYear();
	calendarData: any = {}
	CalendarEvent: any = [];
	eventsDetail: any = [];
	years :any = [];
	hasData : boolean = false;

	minYear :string= "";
	maxYearVal : string = "";
	maxYear : string ="";
	noScroll: boolean = true;

	selectedDate : any;

	fetchingEvents: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, private service: AdapterServiceProvider,private config : ConfigProvider,
		public utils: UtilsProvider, public strings: StringsProvider, private logger: LoggerServiceProvider, private itctolocal: IctToLocal,public menu: MenuController,private calendarService: CalendarServiceProvider) {
		this.service.analytics("Calendar");
		this.datePipe = new DatePipe("en-US");

		/** caledar min  max year */
		this.minYear = this.config.utility.getCalendarMinYear();
		this.maxYear =   this.config.utility.getCalendarMaxYear();
		this.maxYearVal = this.config.maxYearVal;
		let i;
		for(i= this.minYear; i <= 2099 ; i++)
		{
			this.years.push(i);
		}
		
		//this.eventsDetail = [{activityName : 'Birthday', activityDescription : 'Birthday 2'}];

		// Event listener to udpate the height of events div
		window.addEventListener("orientationchange", () => {
			this.updateEventsHeight(this.eventsDetail.length);

			this.isLicenseUpdated = false;
			this.updateLicenseTextPosition();

		}, false);
	}


	ionViewDidLoad() {

		/** set default value of year and month dropdown to current date */
		this.yearModified =  this.currentYear.nativeElement.innerText;

		/** getting first month events by passing current year and month */
		this.getCalendarEvents(this.datePipe.transform(new Date(), 'yyyyMM'), true);
		
	
	
	}

	/** displaying  events count  */
	getEventsCountForDate(eventDate: string, event?) {

		let property = this.datePipe.transform(eventDate, 'yyyyMMdd');
		if (this.customEvent.hasOwnProperty(property)) {

			if(event){
				event.classList.add('cal-day-badge');
			}
			return this.customEvent[property];
		}

		return;
	}

	getCalendarEvents(calendarPeriod: string, isPaeLoadingFirt: boolean) {
		this.calendarService.getCalendarSummary(calendarPeriod).then((res) => {
			try {
				this.utils.hideLoader();
				
				/** Hide scroll when loader displayed */
				this.noScroll = false;

				this.logger.log("getCalendarEvents success:" + JSON.stringify(res['responseJSON']));
				if (res['responseJSON'] && res['responseJSON']['statusCode'] == 200 && res['responseJSON']['result'].toUpperCase() == "SUCCESS") {

					if (res['responseJSON'] && res['responseJSON']['datas'].length > 0) {

						/**catch the calendar month events */
						this.calendarData[calendarPeriod] = res['responseJSON']['datas'];
						let monthEvents = res['responseJSON']['datas'];
						for (let i = 0; i < monthEvents.length; i++) {

							monthEvents[i]['calendarDate'] = this.itctolocal.transform(monthEvents[i]['calendarDate']); //transforming date

							this.customEvent[this.datePipe.transform(monthEvents[i]['calendarDate'], 'yyyyMMdd')] = monthEvents[i]['activityCount'];
							/** when first time getting events and if the current date having events getting details for that event */

							if (isPaeLoadingFirt && this.datePipe.transform(monthEvents[i]['calendarDate'], 'yyyyMMdd') == this.datePipe.transform(new Date(), 'yyyyMMdd')) {
								/** By passing current day getting events details  */
								this.getCalendarDetailsByDay(this.datePipe.transform(new Date(), 'yyyyMMdd'))

							}

						}
						this.hasData = true;
						
						
					} else {
						this.utils.showToastMsg(res['responseJSON']['message']);
					}


				} else {
					/**false: showing toast message  */
					this.service.handlingErrorResponse(false,res);
				}
			} catch (e) {
				this.logger.error("calendar Summary catch error:" + JSON.stringify(e));
			}

			//this.calendarData[this.calendarPeriod] = calendarPeriod;
		}, (err) => {
				this.utils.hideLoader();
				this.logger.error("calendar Summary service error:" + JSON.stringify(err));
			
			/** Hide scroll when loader displayed */
			this.noScroll = false;
		});

	}

	colors: any = {
		red: {
			primary: '#ad2121',
			secondary: '#FAE3E3'
		},
		blue: {
			primary: '#1e90ff',
			secondary: '#D1E8FF'
		},
		yellow: {
			primary: '#e3bc08',
			secondary: '#FDF1BA'
		}
	};

	/** tohide the inline caledar events showing: ovveriding deaflut behaviour  */
	activeDayIsOpen: boolean = false;

	dayEventClick(date) {
		this.eventContent._scrollContent.nativeElement.scrollTop = 0;
		this.content.scrollToTop();
		if (date) {
			
			if (this.getEventsCountForDate(date)) {
				this.fetchingEvents = true;
					this.selectedDate = date;

					setTimeout(() => {
						/** showing  details is there is no evenst */
						this.isEvents = false;
						this.eventsDetail = [];
						let value = this.datePipe.transform(date, 'yyyyMMdd');
						this.getCalendarDetailsByDay(value);
					}, 200);
								
				} else {
					/** hiding details is there is no evenst */
					this.isEvents = true;
					this.selectedDate = "";
					//this.utils.showToastMsg("There is no events for this day");

				}

				
		}else{
			this.selectedDate = "";
		} 
		

	}

	/** get caledar details */
	getCalendarDetailsByDay(date) {

		this.calendarService.getCalendarDetails(date).then((res) => {
			this.fetchingEvents = false;
			try {
				// this.utils.hideLoader();
				
				/** Hide scroll when loader displayed */
				this.noScroll = false;

				this.logger.log("calendarSummary success:" + JSON.stringify(res['responseJSON']));
				if (res['responseJSON'] && res['responseJSON']['statusCode'] == 200 && res['responseJSON']['result'].toUpperCase() == "SUCCESS") {

					/**catch the calendar month events */
					if (res['responseJSON']['datas'].length > 0) {
						this.eventsDetail = res['responseJSON']['datas'];
						this.updateEventsHeight(this.eventsDetail.length);
						
					}
					else {
						this.utils.showToastMsg(res['responseJSON'['message']]);
					}
				} else {
					/**false showing toast message */
					this.service.handlingErrorResponse(false,res);
				}
			} catch (e) {
				this.logger.error("calendar events by date catch error:" + JSON.stringify(e));
			}

		}, (err) => {
			this.fetchingEvents = false;
			// this.utils.hideLoader();
			
			/** Hide scroll when loader displayed */
			this.noScroll = false;
			this.logger.error("calendar events by date fail:" + JSON.stringify(err));
		});

	}




	/** Set date when year is changed and month not changed */
	changeYear(newValue) {
		this.data = this.monthSelected;
		switch (this.data) {
			case 'Tháng 1':
				this.monthNum = '01';
				break;
			case 'Tháng 2':
				this.monthNum = '02';
				break;
			case 'Tháng 3':
				this.monthNum = '03';
				break;
			case 'Tháng 4':
				this.monthNum = '04';
				break;
			case 'Tháng 5':
				this.monthNum = '05';
				break;
			case 'Tháng 6':
				this.monthNum = '06';
				break;
			case 'Tháng 7':
				this.monthNum = '07';
				break;
			case 'Tháng 8':
				this.monthNum = '08';
				break;
			case 'Tháng 9':
				this.monthNum = '09';
				break;
			case 'Tháng 10':
				this.monthNum = '10';
				break;
			case 'Tháng 11':
				this.monthNum = '11';
				break;
			case 'Tháng 12':
				this.monthNum = '12';
				break;
		}
		this.viewDate = new Date(newValue, this.monthNum - 1);
		//this.checkdata(this.viewDate);


		this.calendarPeriod = newValue + "" + this.monthNum;
		/** when year change getting current yerar n month events*/
		if (this.calendarPeriod != undefined) {
			this.checkEventsAvailable(this.calendarPeriod);
		}

		this.eventsDetail = [];
	}

	/** Set date when month is changed and year not changed */
	changeMonth(newValue) {

		switch (newValue) {
			case 'Tháng 1':
				this.monthNum = '01';
				break;
			case 'Tháng 2':
				this.monthNum = '02';
				break;
			case 'Tháng 3':
				this.monthNum = '03';
				break;
			case 'Tháng 4':
				this.monthNum = '04';
				break;
			case 'Tháng 5':
				this.monthNum = '05';
				break;
			case 'Tháng 6':
				this.monthNum = '06';
				break;
			case 'Tháng 7':
				this.monthNum = '07';
				break;
			case 'Tháng 8':
				this.monthNum = '08';
				break;
			case 'Tháng 9':
				this.monthNum = '09';
				break;
			case 'Tháng 10':
				this.monthNum = '10';
				break;
			case 'Tháng 11':
				this.monthNum = '11';
				break;
			case 'Tháng 12':
				this.monthNum = '12';
				break;
		}
		 this.monthNum = Number(this.monthNum);
		let currentMonthYear = this.monthNum;
		
		currentMonthYear = currentMonthYear >= 10 ? currentMonthYear : "0" + currentMonthYear;
		this.data = this.yearSelected;
		currentMonthYear = this.data + "" + currentMonthYear;

		this.viewDate = new Date(this.data, this.monthNum - 1); 
		this.checkEventsAvailable(currentMonthYear);

		this.eventsDetail = [];

	}

	checkEventsAvailable(monthYear) {
		this.hasData = false;

		if (!this.calendarData.hasOwnProperty(monthYear)) {
			setTimeout(() => {
				this.getCalendarEvents(monthYear, false);
			}, 300);
		}else{
			this.hasData = true;
		}
	}
	goBack(){
 			this.navCtrl.pop();
	}

	/** Calculate height of the events div */
	updateEventsHeight(count){
		setTimeout(() => {

			let contentHeight = this.content.contentHeight;
			let calendarHeight = this.calendarDiv.nativeElement.offsetHeight;
			let contentPadding = 32; // Top and Bottom 16px padding
			let extraPadding = 16; // extra space b/w calendar div and top
			let h = contentHeight - calendarHeight - contentPadding - extraPadding;

			if(contentHeight > calendarHeight && h > 175){
				this.eventsHeight = h + "px";
			}else{
				if(count > 1)
					this.eventsHeight = "200px"; // each event takes 80px, 200px is to accomodate 2 events
				else if(count <= 1)
					this.eventsHeight = "100px"; // each event takes 80px, 100px is to accomodate 1 events

			}

		}, 400); // 400 delay is to let the content update
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
