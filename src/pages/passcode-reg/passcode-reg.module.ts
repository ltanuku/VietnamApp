import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasscodeRegPage } from './passcode-reg';

@NgModule({
  declarations: [
    PasscodeRegPage,
  ],
  imports: [
    IonicPageModule.forChild(PasscodeRegPage),
  ],
})
export class PasscodeRegPageModule {}
