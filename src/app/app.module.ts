import { RestrictInputDirective } from './../providers/directives/restrict-input';
import { DatePipe } from '@angular/common';
import { Keyboard } from '@ionic-native/keyboard';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { IncomeDetailsServiceProvider } from './../pages/income-details/income-details-service';
import { SunElitePage } from './../pages/sun-elite/sun-elite';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { CalendarModule } from 'angular-calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyApp } from './app.component';
import { File } from '@ionic-native/file';
import { Device } from '@ionic-native/device';

/** Providers */
import { AdapterServiceProvider } from '../providers/adapter-service/adapter-service';
import { AuthHandlerProvider } from '../providers/auth-handler/auth-handler';
import { UtilsProvider } from '../providers/utils/utils';
import { JsonStoreProvider } from '../providers/json-store/json-store';
import { ConfigProvider } from "../providers/config/config";
import { CustomDateFormatterProvider } from '../providers/custom-date-formatter/custom-date-formatter';
import { StringsProvider } from '../providers/strings/strings';
import { LoggerServiceProvider } from '../providers/logger-service/logger-service';
import { FileStorageProvider } from '../providers/file-storage/file-storage';
import { PolicyListProvider } from '../pages/search-results/policy-list';
import { UnderwritingProvider } from '../pages/pending-underwriting/underwriting';
import { PolicyIssuedProvider } from '../pages/pending-issued/policy-issued';
import { DetailsProvider } from '../pages/search-details/details';
import { PolicySearchServiceProvider } from '../pages/policy-search/policy-search-results/policy-search-service';
import { HomeServiceProvider } from '../pages/home/home-service';
import { IncomeServiceProvider } from '../pages/income/income-service';
import { IndividulPerformanceServiceProvider } from '../pages/individual-performance/individul-performance-service';
import { MdrtServiceProvider } from '../pages/mdrt/mdrt-service';
import { FullYearServiceProvider } from '../pages/fullyear-report/full-year-service';
import { SunEliteServiceProvider } from '../pages/sun-elite/sun-elite-service';
import { GroupPerformanceServiceProvider } from '../pages/group-performance/group-performance-service';
import { ChangepasswdServiceProvider } from '../pages/changepassword/changepasswd-service';

/** Pages */
import { ChangepasswordPage } from "../pages/changepassword/changepassword";
import { SlideDetailsPage } from "../pages/slide-details/slide-details";
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { PasscodePage } from '../pages/passcode/passcode';
import { PasscodeLoginPage } from "../pages/passcode-login/passcode-login";
import { PasscodeRegPage } from "../pages/passcode-reg/passcode-reg";
import { CalendarPage } from "../pages/calendar/calendar";
import { PendingUnderWritingPage } from "../pages/pending-underwriting/pending-underwriting";
import { PendingIssuedPage } from "../pages/pending-issued/pending-issued";
import { SearchResultsPage } from  '../pages/search-results/search-results';
import { SearchDetailsPage } from '../pages/search-details/search-details';
import { IndividualPerformancePage } from '../pages/individual-performance/individual-performance';
import { ProfilePage } from '../pages/profile/profile';
import { SlideListPage } from '../pages/slide-list/slide-list';
import { FooterBarComponent } from '../pages/footer-bar/footer-bar';
import { PolicyStatusPage } from '../pages/policy-status/policy-status';
import { SlideDetailsServiceProvider } from '../pages/slide-details/slide-details-service';
import { SlideListServiceProvider } from '../pages/slide-list/slide-list-service';
import { PolicySearchPage } from '../pages/policy-search/policy-search'
import { PolicySearchResultsPage } from '../pages/policy-search/policy-search-results/policy-search-results';
import { MdrtPage } from '../pages/mdrt/mdrt';
import { SunElitePagePersonal } from '../pages/sun-elite/sun-elite-personal/sun-elite-personal';
import { SunElitePageUnit } from '../pages/sun-elite/sun-elite-unit/sun-elite-unit';
import { SunElitePageBranch } from '../pages/sun-elite/sun-elite-branch/sun-elite-branch';
import { IncomePage } from '../pages/income/income';
import { GroupPerformancePage } from '../pages/group-performance/group-performance';
import { FullyearReportPage } from '../pages/fullyear-report/fullyear-report';
import { FullYearPersonalPage } from '../pages/fullyear-report/full-year-personal/full-year-personal';
import { FullYearUnitPage } from '../pages/fullyear-report/full-year-unit/full-year-unit';
import { FullYearBranchPage } from '../pages/fullyear-report/full-year-branch/full-year-branch';

/** pipes */
import { DateFormatPipe, displayHyphen, decimal, displayDefaultImage,IctToLocal } from '../pipes/date-format/date-format';
import { IncomeDetailsPage } from '../pages/income-details/income-details';
import { CalendarServiceProvider } from '../pages/calendar/calendar-service';
import { MyProfileServiceProvider } from '../pages/profile/my-profile-service';
import { PasscodeLoginServiceProvider } from '../pages/passcode-login/passcode-login-service';
import { PasscodeRegServiceProvider } from '../pages/passcode/passcode-reg-service';
import { LoginServiceProvider } from '../pages/login/login-service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { popupPage } from '../pages/popup/popup.component';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
	LoginPage,
    PasscodeLoginPage,
	PasscodePage,
 	CalendarPage,
    ChangepasswordPage,
    ForgotPasswordPage,
	SlideDetailsPage,
    PasscodeRegPage,
	PendingUnderWritingPage,
	PendingIssuedPage,
	SearchResultsPage,
    SearchDetailsPage,
    IndividualPerformancePage,
	ProfilePage,
	SlideListPage,
	FooterBarComponent,
	PolicyStatusPage,
    SunElitePage,
    PolicySearchPage,
    PolicySearchResultsPage,
	MdrtPage,
    IncomePage,
    IncomeDetailsPage,
    DateFormatPipe,
	SunElitePagePersonal,
	SunElitePageUnit,
    SunElitePageBranch,
    displayHyphen,
	GroupPerformancePage,
    FullyearReportPage,
    displayDefaultImage,
    IctToLocal,
    decimal,
    RestrictInputDirective,
    FullYearPersonalPage,
    FullYearUnitPage,
    FullYearBranchPage,
	popupPage
  ],
  imports: [
    BrowserModule,
    PdfViewerModule,  
		
    IonicModule.forRoot(MyApp,{	
		iconMode: 'ios',
		backButtonIcon : "ios-arrow-back",
		monthNames: [ 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
	}),
	HttpModule,
	BrowserAnimationsModule,
    CalendarModule.forRoot(),
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    PasscodeLoginPage,
	PasscodePage,
    HomePage,
    CalendarPage,
    ChangepasswordPage,
    ForgotPasswordPage,
    SlideDetailsPage,
    PasscodeRegPage,
	PendingUnderWritingPage,
	PendingIssuedPage,
	SearchResultsPage,
    SearchDetailsPage,
    IndividualPerformancePage,
	ProfilePage,
	SlideListPage,
	FooterBarComponent,
	PolicyStatusPage,
    SunElitePage,
    PolicySearchPage,
    PolicySearchResultsPage,
	MdrtPage,
    IncomePage,
    IncomeDetailsPage,
	SunElitePagePersonal,
	SunElitePageUnit,
	SunElitePageBranch,
	GroupPerformancePage,
    FullyearReportPage,
    FullYearPersonalPage,
    FullYearUnitPage,
    FullYearBranchPage,
	popupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AdapterServiceProvider,
    JsonStoreProvider,
    ConfigProvider,
    Device,
    File,
    CustomDateFormatterProvider,
    StringsProvider,
    AuthHandlerProvider,
    UtilsProvider,
    FileStorageProvider,
    LoggerServiceProvider,
    PolicyListProvider,
    UnderwritingProvider,
    PolicyIssuedProvider,
    DetailsProvider,
    SlideDetailsServiceProvider,
    SlideListServiceProvider,
    PolicySearchServiceProvider,
    IndividulPerformanceServiceProvider,
    HomeServiceProvider,
    IndividulPerformanceServiceProvider,
    IncomeServiceProvider,
    IncomeDetailsServiceProvider,
    DateFormatPipe ,
    IctToLocal,
    decimal,
    MdrtServiceProvider,
    FullYearServiceProvider,
    SunEliteServiceProvider,
    GroupPerformanceServiceProvider,
    DatePipe,
    ChangepasswdServiceProvider,
    CalendarServiceProvider,
    MyProfileServiceProvider,
    PasscodeLoginServiceProvider,
    PasscodeRegServiceProvider,
    LoginServiceProvider,
    FingerprintAIO
  ]
})
export class AppModule {}
