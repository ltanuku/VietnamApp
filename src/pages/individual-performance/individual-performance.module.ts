import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IndividualPerformancePage } from './individual-performance';

@NgModule({
  declarations: [
    IndividualPerformancePage,
  ],
  imports: [
    IonicPageModule.forChild(IndividualPerformancePage),
  ],
})
export class IndividualPerformancePageModule {}
