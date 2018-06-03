import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PolicySearchResultsPage } from './policy-search-results';

@NgModule({
  declarations: [
    PolicySearchResultsPage,
  ],
  imports: [
    IonicPageModule.forChild(PolicySearchResultsPage),
  ],
})
export class PolicySearchResultsPageModule {}
