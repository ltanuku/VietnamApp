import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {
    public userInfo: any = {};
    public utility: any = {};
    public colorCodes: any = {};
	public maxYearVal = "2099";
    // Base64 encoded key for password encryption
    public base64Key : string = "UGaqr2hhOn3OSCmUWrBnVw==";
    public clientId : string = "Sun Advisor";
    public clientSecret : string = "sun_advisor@sunlife";

    constructor() {

        this.userInfo = {
            userID: null,
            deviceID: null,
            token: null,
            agentCode: null,
            userType: null,
            sessionId: "",
            agentsList:  [],
            userPasswd :""

        }
		
        this.utility = {
            getCalendarMaxYear: function () {
                let datePipe = new DatePipe("en-US");
                return datePipe.transform(new Date("Dec 31, 2099 01:15:00"), "yyyy-mm-dd");     // this.datePipe.transform(minDate, 'YYYY');
            },   /** this minDate using for sidemenu screen */

            getCalendarMinYear: function () {
                let datePipe = new DatePipe("en-US");
                return parseInt(datePipe.transform(new Date(), "yyyy")) - 1;     // this.datePipe.transform(minDate, 'YYYY');
            },
            getDateFormat: function () {
                return "DD-MM-YYYY";
            }
        }

        this.colorCodes = {
            waitingForAckColor: '#5482ab',
            inGracePeriodColor: '#d0651e',
            cancelGracePeriodColor: '#82786f',
            inPremiumPeriodColor: '#658237',
            lapsedColor: '#003946',
            insuranceFeeColor: '#fff',
            defaultColor: '#658237',
            pendingUnderWritingColor: '#5482ab',
            supplementaryUnderWritingColor: '#d0651e',
            medicalExamUnderWritingColor: '#82786f',
            acceptanceUnderWritingColor: '#658237',
        }
    }

}
