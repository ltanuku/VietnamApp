import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { Chart } from 'chart.js';
import { AdapterServiceProvider } from "../../providers/adapter-service/adapter-service";
import { IndividulPerformanceServiceProvider } from './individul-performance-service';
import { StringsProvider } from '../../providers/strings/strings';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoggerServiceProvider } from '../../providers/logger-service/logger-service';
import { DatePipe } from '@angular/common';
import {IctToLocal} from '../../pipes/date-format/date-format';
import {ConfigProvider} from '../../providers/config/config';
/**
 * Generated class for the IndividualPerformancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-individual-performance',
  templateUrl: 'individual-performance.html',
})
export class IndividualPerformancePage {

	@ViewChild('barCanvas') barCanvas;
	@ViewChild('lineCanvas') lineCanvas;
	@ViewChild(Content) content;

    barChart: any;
    lineChart:any;
	barChartData: any = [];
	lineChartData: any = [];
	isAgentList: string = 'inactive';
	individualData: any = [];
	graphObj: any = {};
	month: any = [ "", "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12" ];
	color: any = [];
	xline: any = [];
	xbar: any = [];
	activeDate: any;
	datePipe:any;
	dataSuccess: any;
	noGraphData: boolean = true;
	noScroll: boolean = true;
	alignBottom: any = '';
	isLicenseUpdated : boolean = false;

	selectedID:any
	agentsList :any = [];
	selectedAgentLevel :any;
	serviceCallCompleted : boolean = false;


	constructor(public navCtrl: NavController, public navParams: NavParams, public service: AdapterServiceProvider, private individulPerformanceService : IndividulPerformanceServiceProvider, private utils: UtilsProvider, private strings: StringsProvider, private logger: LoggerServiceProvider,public config : ConfigProvider, private itctolocal :IctToLocal) {
		service.analytics("Individual Performance");
		this.datePipe = new DatePipe("en-US");

		/** Hide graph until service response success */
		this.dataSuccess = {'opacity': 0}


		if(this.config.userInfo.agentsList.length >0){
			this.agentsList = this.config.userInfo.agentsList;

			/**by deafult first userid selectd */
			this.selectedAgentLevel = this.agentsList[0]['agentLevel']+"-"+this.agentsList[0]['agentCode']+"-"+this.agentsList[0]['agentName'];

			/**default selected value */
			this.selectedID = this.agentsList[0]['agentCode'];
			/** Calling Individual performance service */
			this.getIndividualSummaryData(this.agentsList[0]['agentCode']);
		}else{
			/** true for back navigation  and nodata message*/
			this.service.showMessagePopup(true,this.strings.noData);
			this.noScroll = false;

		}

		this.updateLicenseTextPosition();
		// Event listener to udpate the height of events div
		window.addEventListener("orientationchange", () => {

			this.isLicenseUpdated = false;
			this.updateLicenseTextPosition();

		}, false);
	}

	/** toggle agent Tree */
	showAgentList(){
		this.isAgentList  == 'active'? this.isAgentList = 'inactive' : this.isAgentList = 'active';
	}

	/** agents list click event */
	setAction (item, selectedID){

		this.selectedID = selectedID;
		this.isAgentList  == 'active'? this.isAgentList = 'inactive' : this.isAgentList = 'active';
		this.selectedAgentLevel = item.agentLevel+"-"+item.agentCode+"-"+item.agentName;
		this.getIndividualSummaryData(selectedID);
		this.individualData = [];
	}

	/** Getting data from Individual performance service */
	getIndividualSummaryData(agentID){
		if (this.utils.isDeviceOnLine()) {
			this.individulPerformanceService.getIndividulPerformance(agentID).then((res)=>{
				try{
					this.serviceCallCompleted = true;
					this.utils.hideLoader();

					/** Hide scroll when loader displayed */
					this.noScroll = false;

					this.logger.log("Individual Performance success response"+JSON.stringify(res));

					/** Validating success */
					if(res['responseJSON'] && res['responseJSON']['statusCode'] == 200 && res['responseJSON']['result'].toUpperCase()  == "SUCCESS"){
						this.content.scrollToTop();

						this.individualData = res['responseJSON'];

						this.individualData.activeDate = this.itctolocal.transform(this.individualData.activeDate);
						this.activeDate = parseInt(this.datePipe.transform(this.individualData.activeDate, 'yyyy'));

						for(let i=0; i< this.individualData.prodAgentGraphList.length; i++ ){
							this.graphObj = this.individualData.prodAgentGraphList[i];

							/** checking previous year data and keep into array */
							if (this.graphObj.grapH_Year == this.activeDate - 1){
								this.lineChartData[this.graphObj.grapH_Month - 1] = this.graphObj.grapH_FYP;

								this.xline[this.graphObj.grapH_Month - 1] = this.month[this.graphObj.grapH_Month];
							} else {
								this.barChartData[this.graphObj.grapH_Month - 1] = this.graphObj.grapH_FYP;

								this.xbar[this.graphObj.grapH_Month - 1] = this.month[this.graphObj.grapH_Month];
								if (this.graphObj.grapH_FYP_CHG < 0) {
									this.color[this.graphObj.grapH_Month - 1] = "red";
								} else {
									this.color[this.graphObj.grapH_Month - 1] = "green";
								}

							}
						}

						/** Hide graph when there is no data */
						if(this.individualData.prodAgentGraphList.length != 0){
							this.dataSuccess = {'opacity': 1};
							this.noGraphData = true;
						}else{
							this.noGraphData = false;
						}

						let graphData = {

							labels : this.xline,
							datasets : [
								{
									type : 'line',
									label : this.activeDate - 1,
									backgroundColor : "#F5F5F5",
									data: this.lineChartData,
									borderColor : '#003946',
									borderWidth : 1.5,
									pointStyle: 'circle',
									pointBorderColor : '#003946',
									pointBackgroundColor : 'transparent',
									pointHitRadius : 15,
									fill:false,


								},
								{
									type : 'bar',
									label : this.activeDate,
									backgroundColor : '#eaab00',
									data: this.barChartData,
									borderColor : '#eaab00',
									borderWidth : 1,
									pointRadius: 5,
									pointStyle: 'circle',

								}
							]

						}

						this.barChart = new Chart(this.barCanvas.nativeElement, {
							type: 'bar',
							data: graphData,
							options: {
								responsive:true,
								legend: {
									position: 'bottom',
									labels: {
										usePointStyle: false
									}
								},
								scales: {
									xAxes: [{
										gridLines: {
											display: true,
											drawBorder: true,
											drawOnChartArea: true,
											drawTicks: true,
										},
									}],
									yAxes: [{
										gridLines: {
											display: true,
											drawBorder: true,
											drawOnChartArea: true,
											drawTicks: true,
										},
										ticks: {
											beginAtZero:true,
											callback: function(value, dataLabel, index) {
												// Hide the label of every 2nd dataset. return null to hide the grid line too
												//return index % 2 === 0 ? dataLabel : '';
												return  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
											}
										}
									}]
								},
								tooltips: {
									callbacks: {
										label: function(tooltipItem, data){
											return data.datasets[tooltipItem.datasetIndex].label + ' : ' + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
										}
									}
								}
							}

						});
						this.updateLicenseTextPosition();
					}else{

						/**display popup with message */
						this.utils.showToastMsg(res['responseJSON']['message']);
					}
				}catch(e){
					this.serviceCallCompleted = true;
					this.utils.hideLoader();

					/** Hide scroll when loader displayed */
					this.noScroll = false;
					this.logger.error("Individual Performance catch error "+JSON.stringify(e));
				}
			},(err)=>{
				this.utils.hideLoader();

				/** Hide scroll when loader displayed */
				this.noScroll = false;
				/**hiding graph in server error */
				this.noGraphData = false;
				this.logger.error("Individual Performance Service failure "+JSON.stringify(err));
				this.showMessagePopup(this.strings.serverError);
			});
		}else{
			this.showMessagePopup(this.strings.noNetwork);
		}

	}

	/* showing data failure message and server failure message **/
	showMessagePopup(message){
		this.utils.showToastMsg(message);
	}

	ionViewDidLoad() {

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
