import { StringsProvider } from './../strings/strings';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { LoadingController, Platform, AlertController, ToastController, Content } from 'ionic-angular';
import { ConfigProvider } from "../config/config";
/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

/* export enum sideMenuPages {
  UNDERWRITING,
  SUPPLEMENTATION,
  HEALTH_CHECK,
  ACCEPTANCE_LETTER,
  WAITING_FOR_ACK,
  IN_GRACE_PERIOD,
  CANCEL_GRACE_PERIOD,
  IN_PREMIUM_PERIOD,
  LAPSED,
  CLAIM_SEARCH
} */

@Injectable()
export class UtilsProvider {
  public loader: any = null;

  private TOAST_POSITION = 'bottom';
  private TOAST_DURATION = 3500;

  constructor(public loadingCtrl: LoadingController, public platform: Platform, public device: Device, public alertCtrl: AlertController,
    public config: ConfigProvider, public toastCtrl: ToastController, private strings: StringsProvider) {

  }


  /** isdevice**/
  isDevice() {

    return this.platform.is('cordova');
  }

  /** Get Device Id */
  getDeviceId() {
    return this.device ? this.device.uuid : "WEB";
  }


  /** session implementation **/

  isLogged(): boolean {
    if (typeof (Storage) != "undefined") {

      if (sessionStorage.getItem("userInfo")) {
        return true;
      }
    }
    return false;
  }

  /** session complete navigation **/
  sessionNavigation() {


  }

  /** checking online or offline */
  isDeviceOnLine(): boolean {
    return navigator.onLine;
  }

  /** showing loader **/
  public showLoader() {
    if (this.loader == null) {
      this.loader = this.loadingCtrl.create({
		  spinner: 'hide',
		  content: ` <div class="loader row">
						  <div class="dot"></div>
						  <div class="dot"></div>
						  <div class="dot"></div>
						  <div class="dot"></div>
						  <div class="dot"></div>
						</div>`
      });
    }
    this.loader.present();
  }
  /** hide loader **/
  public hideLoader() {
    if (this.loader == null) {
      this.loader = this.loadingCtrl.create({
        content: this.strings.pleaseWait
      });
    }
    this.loader.dismiss();
    this.loader = null;
  }

  /** PageSize for Load more functionality */
  pageSize = 10;

  /** getUserIID**/
  getUserID() {
    return this.config.userInfo.agentCode;
  }

  /** getUserIID**/
  getToekn() {
    return this.config.userInfo.token;
  }

  /** showing  popup***/

  public showMessage(title, msg, btn) {

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: btn
    });
    alert.present();
  }

  /**
   * Show Taost Message 
   * @param msg -- Message to show (mandatory)
   * @param position -- Position of Toast (optional), default bottom
   * @param duration -- duration (optional), default 3000
   */
  public showToastMsg(msg: string, position?: string, duration?: number) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: duration ? duration : this.TOAST_DURATION,
      position: position ? position : this.TOAST_POSITION
    });


    toast.present();
  }

  /** getting device width */
  getDeviceWidth() {

    return window.innerWidth;
  }
  /** getting device width */
  getDeviceHeight() {

    return window.innerHeight;
  }


  getSessionId() {
    return ((new Date()).getTime() + "" + this.getDeviceId());
  }

  getLicenseTextStyles(): any {
    let style = { 'position': 'relative' }
    return style;
  }
}
