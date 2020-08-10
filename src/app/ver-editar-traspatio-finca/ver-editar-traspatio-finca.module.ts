import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerEditarTraspatioFincaPageRoutingModule } from './ver-editar-traspatio-finca-routing.module';

import { VerEditarTraspatioFincaPage } from './ver-editar-traspatio-finca.page';

import {ProvinciasPageModule} from '../modals/provincias/provincias.module';
import {CantonesPageModule} from '../modals/cantones/cantones.module';
import {DistritosPageModule} from '../modals/distritos/distritos.module';
import {FincasPobladosPageModule} from '../modals/fincas-poblados/fincas-poblados.module';
import {LotesPropietariosPageModule} from '../modals/lotes-propietarios/lotes-propietarios.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VerEditarTraspatioFincaPageRoutingModule,
    ProvinciasPageModule,
    CantonesPageModule,
    DistritosPageModule,
    FincasPobladosPageModule,
    LotesPropietariosPageModule
  ],
  declarations: [VerEditarTraspatioFincaPage]
})
export class VerEditarTraspatioFincaPageModule {}
