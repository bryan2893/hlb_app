import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerEditarInspeccionHlbPageRoutingModule } from './ver-editar-inspeccion-hlb-routing.module';

import { VerEditarInspeccionHlbPage } from './ver-editar-inspeccion-hlb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VerEditarInspeccionHlbPageRoutingModule
  ],
  declarations: [VerEditarInspeccionHlbPage]
})
export class VerEditarInspeccionHlbPageModule {}
