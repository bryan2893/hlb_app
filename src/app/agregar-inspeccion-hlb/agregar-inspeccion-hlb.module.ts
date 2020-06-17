import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarInspeccionHlbPageRoutingModule } from './agregar-inspeccion-hlb-routing.module';

import { AgregarInspeccionHlbPage } from './agregar-inspeccion-hlb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarInspeccionHlbPageRoutingModule
  ],
  declarations: [AgregarInspeccionHlbPage]
})
export class AgregarInspeccionHlbPageModule {}
