import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PolicyStatusPage } from './policy-status';

@NgModule({
  declarations: [
    PolicyStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(PolicyStatusPage),
  ],
})
export class PolicyStatusPageModule {}
