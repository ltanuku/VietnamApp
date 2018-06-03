import { decimal } from './../../pipes/date-format/date-format';
import {App} from 'ionic-angular';
import { UtilsProvider } from './../utils/utils';
import { ConfigProvider } from './../config/config';
import { Injectable } from '@angular/core';
//import { NavController } from 'ionic-angular';
import {LoginPage} from '../../pages/login/login';
import {JsonStoreProvider} from '../../providers/json-store/json-store';

declare var WL;
declare var WLAuthorizationManager;
declare var wl_directUpdateChallengeHandler;

@Injectable()
export class AuthHandlerProvider {

    public authHandler: any;
    readonly securityCheckName: string = "userAuthentication";
    isChallenged: boolean = false;
    private credentials = undefined;

    constructor(private config: ConfigProvider, public utils: UtilsProvider,private app: App,public jsonStore: JsonStoreProvider, public decimalPipe : decimal) {
        
    }



    /**
       * Init Security Check for authentication user
       */
    authInit() {

      wl_directUpdateChallengeHandler.handleDirectUpdate =  (directUpdateData, directUpdateContext)=> {

            let size = "";

            let dataBytes = directUpdateData.downloadSize;
            let dataKB = dataBytes / 1000;

            size = this.decimalPipe.transform(dataKB) + " KB";

            if(dataKB > 1000){
                let dataMB = dataKB / 1000;
                size = this.decimalPipe.transform(dataMB) + " MB";
            }

            WL.SimpleDialog.show('Update Avalible', 'An update of application is available (file size ' + size + ' )', [{
                text: 'Update',
                handler:  () => {
                    this.utils.hideLoader();
                    directUpdateContext.start();
                }
            }]);
      };


        this.authHandler = WL.Client.createSecurityCheckChallengeHandler(this.securityCheckName);

        this.authHandler.handleChallenge = ((response) => {

            if (response == "credentialsRequired") {
                /* user need to navigate to login , once session is timeout**/
                this.jsonStore.removeDataInJson(this.jsonStore.collectionNames.userDetails);
             // this.navCtrl.setRoot(LoginPage);
             this.app.getActiveNav().setRoot(LoginPage);
            
            }else{
                this.isChallenged = true;
                this.submitCredentials();
            }
            
        });

        this.authHandler.handleSuccess = ((response) => {
            this.isChallenged = false;
        });

        this.authHandler.handleFailure = ((response) => {
            this.isChallenged = false;
        });
    }

    /**
     * Submit challenge handler
     */
    submitCredentials() {

        if (this.credentials == undefined) {
            this.credentials = {
                "isValidUser": true,
                "userId": this.config.userInfo.userID,
            }
        }
        if (this.isChallenged) {
            this.authHandler.submitChallengeAnswer(this.credentials);
            return null;
        }
        else {
            return WLAuthorizationManager.login(this.securityCheckName, this.credentials);
        }
    }

    /**
     * Logout current authenticated user
     */
    logout() {
        return new Promise((resolve, reject) => {
            return WLAuthorizationManager.logout(this.securityCheckName)
                .then(() => {
                    this.credentials = undefined;
                    resolve();
                }, () => {
                    reject();
                });
        })
    }
}
