import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SlideListPage } from './slide-list';

@NgModule({
  declarations: [
    SlideListPage,
  ],
  imports: [
    IonicPageModule.forChild(SlideListPage),
  ],
})
export class SlideListPageModule {}
