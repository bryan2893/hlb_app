import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarInspeccionHlbPageRoutingModule } from './agregar-inspeccion-hlb-routing.module';

import { AgregarInspeccionHlbPage } from './agregar-inspeccion-hlb.page';

import {FincasPobladosPageModule} from '../modals/fincas-poblados/fincas-poblados.module';
import {LotesPropietariosPageModule} from '../modals/lotes-propietarios/lotes-propietarios.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarInspeccionHlbPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FincasPobladosPageModule,
    LotesPropietariosPageModule
  ],
  declarations: [AgregarInspeccionHlbPage]
})
export class AgregarInspeccionHlbPageModule {}
