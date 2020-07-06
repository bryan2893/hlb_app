import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarManteHlbPageRoutingModule } from './agregar-mante-hlb-routing.module';

import { AgregarManteHlbPage } from './agregar-mante-hlb.page';

import {FincasPobladosPageModule} from '../modals/fincas-poblados/fincas-poblados.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarManteHlbPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FincasPobladosPageModule
  ],
  declarations: [AgregarManteHlbPage]
})
export class AgregarManteHlbPageModule {}
