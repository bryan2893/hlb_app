import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarInspeccionTrampaPageRoutingModule } from './agregar-inspeccion-trampa-routing.module';

import { AgregarInspeccionTrampaPage } from './agregar-inspeccion-trampa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarInspeccionTrampaPageRoutingModule
  ],
  declarations: [AgregarInspeccionTrampaPage]
})
export class AgregarInspeccionTrampaPageModule {}
