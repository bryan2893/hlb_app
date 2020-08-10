import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerEditarInspeccionTrampaPageRoutingModule } from './ver-editar-inspeccion-trampa-routing.module';

import { VerEditarInspeccionTrampaPage } from './ver-editar-inspeccion-trampa.page';
import {FincasPobladosPageModule} from '../modals/fincas-poblados/fincas-poblados.module';
import {LotesPropietariosPageModule} from '../modals/lotes-propietarios/lotes-propietarios.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    VerEditarInspeccionTrampaPageRoutingModule,
    FincasPobladosPageModule,
    LotesPropietariosPageModule
  ],
  declarations: [VerEditarInspeccionTrampaPage]
})
export class VerEditarInspeccionTrampaPageModule {}
