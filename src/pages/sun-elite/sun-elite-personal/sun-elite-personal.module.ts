import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SunElitePagePersonal } from './sun-elite-personal';

@NgModule({
  declarations: [
    SunElitePagePersonal,
  ],
  imports: [
    IonicPageModule.forChild(SunElitePagePersonal),
  ],
})
export class sunElitePersonalModule {}
