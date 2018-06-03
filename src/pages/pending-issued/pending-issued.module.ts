import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendingIssuedPage } from './pending-issued';

@NgModule({
  declarations: [
    PendingIssuedPage,
  ],
  imports: [
    IonicPageModule.forChild(PendingIssuedPage),
  ],
})
export class PendingIssuedPageModule {}
