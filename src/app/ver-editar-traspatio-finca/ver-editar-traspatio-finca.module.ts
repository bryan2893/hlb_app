import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerEditarTraspatioFincaPageRoutingModule } from './ver-editar-traspatio-finca-routing.module';

import { VerEditarTraspatioFincaPage } from './ver-editar-traspatio-finca.page';

import {FincasPobladosPageModule} from '../modals/fincas-poblados/fincas-poblados.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VerEditarTraspatioFincaPageRoutingModule,
    FincasPobladosPageModule
  ],
  declarations: [VerEditarTraspatioFincaPage]
})
export class VerEditarTraspatioFincaPageModule {}
