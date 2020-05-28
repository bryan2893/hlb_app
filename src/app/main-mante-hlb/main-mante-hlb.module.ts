import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainManteHlbPageRoutingModule } from './main-mante-hlb-routing.module';

import { MainManteHlbPage } from './main-mante-hlb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainManteHlbPageRoutingModule
  ],
  declarations: [MainManteHlbPage]
})
export class MainManteHlbPageModule {}
