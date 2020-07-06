import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarInspeccionHlbPageRoutingModule } from './agregar-inspeccion-hlb-routing.module';

import { AgregarInspeccionHlbPage } from './agregar-inspeccion-hlb.page';

//import {MapViewerPageModule} from '../map-viewer/map-viewer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarInspeccionHlbPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [AgregarInspeccionHlbPage]
})
export class AgregarInspeccionHlbPageModule {}
