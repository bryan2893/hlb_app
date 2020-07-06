import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusquedaTraspatiosGpsPageRoutingModule } from './busqueda-traspatios-gps-routing.module';

import { BusquedaTraspatiosGpsPage } from './busqueda-traspatios-gps.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusquedaTraspatiosGpsPageRoutingModule
  ],
  declarations: [BusquedaTraspatiosGpsPage]
})
export class BusquedaTraspatiosGpsPageModule {}
