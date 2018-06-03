import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncomeDetailsPage } from './income-details';

@NgModule({
  declarations: [
    IncomeDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(IncomeDetailsPage),
  ],
})
export class IncomeDetailsPageModule {}
