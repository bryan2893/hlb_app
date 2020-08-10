import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerEditarInspeccionHlbPageRoutingModule } from './ver-editar-inspeccion-hlb-routing.module';

import { VerEditarInspeccionHlbPage } from './ver-editar-inspeccion-hlb.page';

import {FincasPobladosPageModule} from '../modals/fincas-poblados/fincas-poblados.module';
import {LotesPropietariosPageModule} from '../modals/lotes-propietarios/lotes-propietarios.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VerEditarInspeccionHlbPageRoutingModule,
    FincasPobladosPageModule,
    LotesPropietariosPageModule
  ],
  declarations: [VerEditarInspeccionHlbPage]
})
export class VerEditarInspeccionHlbPageModule {}
