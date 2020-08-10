import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LotesPropietariosPageRoutingModule } from './lotes-propietarios-routing.module';

import { LotesPropietariosPage } from './lotes-propietarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LotesPropietariosPageRoutingModule
  ],
  declarations: [LotesPropietariosPage]
})
export class LotesPropietariosPageModule {}
