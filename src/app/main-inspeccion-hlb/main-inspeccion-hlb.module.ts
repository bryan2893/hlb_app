import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainInspeccionHlbPageRoutingModule } from './main-inspeccion-hlb-routing.module';

import { MainInspeccionHlbPage } from './main-inspeccion-hlb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainInspeccionHlbPageRoutingModule
  ],
  declarations: [MainInspeccionHlbPage]
})
export class MainInspeccionHlbPageModule {}
