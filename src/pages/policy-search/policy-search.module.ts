import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PolicySearchPage } from './policy-search';

@NgModule({
  declarations: [
    PolicySearchPage,
  ],
  imports: [
    IonicPageModule.forChild(PolicySearchPage),
  ],
})
export class PolicySearchPageModule {}
