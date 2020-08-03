import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarTrampaPageRoutingModule } from './agregar-trampa-routing.module';

import { AgregarTrampaPage } from './agregar-trampa.page';

import {MapViewerPageModule} from '../map-viewer/map-viewer.module';

import {ProvinciasPageModule} from '../modals/provincias/provincias.module';
import {CantonesPageModule} from '../modals/cantones/cantones.module';
import {DistritosPageModule} from '../modals/distritos/distritos.module';
import {FincasPobladosPageModule} from '../modals/fincas-poblados/fincas-poblados.module';
import {LotesPropietariosPageModule} from '../modals/lotes-propietarios/lotes-propietarios.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarTrampaPageRoutingModule,
    ReactiveFormsModule,
    MapViewerPageModule,
    ProvinciasPageModule,
    CantonesPageModule,
    DistritosPageModule,
    FincasPobladosPageModule,
    LotesPropietariosPageModule
  ],
  declarations: [AgregarTrampaPage]
})
export class AgregarTrampaPageModule {}
