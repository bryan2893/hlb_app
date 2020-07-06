import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerEditarInspeccionTrampaPageRoutingModule } from './ver-editar-inspeccion-trampa-routing.module';

import { VerEditarInspeccionTrampaPage } from './ver-editar-inspeccion-trampa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    VerEditarInspeccionTrampaPageRoutingModule
  ],
  declarations: [VerEditarInspeccionTrampaPage]
})
export class VerEditarInspeccionTrampaPageModule {}
