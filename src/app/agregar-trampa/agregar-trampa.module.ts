import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarTrampaPageRoutingModule } from './agregar-trampa-routing.module';

import { AgregarTrampaPage } from './agregar-trampa.page';

import {MapViewerPageModule} from '../map-viewer/map-viewer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarTrampaPageRoutingModule,
    ReactiveFormsModule,
    MapViewerPageModule
  ],
  declarations: [AgregarTrampaPage]
})
export class AgregarTrampaPageModule {}
