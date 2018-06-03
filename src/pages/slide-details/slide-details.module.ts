import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SlideDetailsPage } from './slide-details';

@NgModule({
  declarations: [
    SlideDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(SlideDetailsPage),
  ],
})
export class SlideDetailsPageModule {}
