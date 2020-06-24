import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerEditarInspHlbPageRoutingModule } from './ver-editar-insp-hlb-routing.module';

import { VerEditarInspHlbPage } from './ver-editar-insp-hlb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerEditarInspHlbPageRoutingModule
  ],
  declarations: [VerEditarInspHlbPage]
})
export class VerEditarInspHlbPageModule {}
