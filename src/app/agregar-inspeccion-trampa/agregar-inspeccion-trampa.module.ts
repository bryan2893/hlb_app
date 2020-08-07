import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarInspeccionTrampaPageRoutingModule } from './agregar-inspeccion-trampa-routing.module';

import { AgregarInspeccionTrampaPage } from './agregar-inspeccion-trampa.page';

import {FincasPobladosPageModule} from '../modals/fincas-poblados/fincas-poblados.module';
import {LotesPropietariosPageModule} from '../modals/lotes-propietarios/lotes-propietarios.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AgregarInspeccionTrampaPageRoutingModule,
    FincasPobladosPageModule,
    LotesPropietariosPageModule
  ],
  declarations: [AgregarInspeccionTrampaPage]
})
export class AgregarInspeccionTrampaPageModule {}
