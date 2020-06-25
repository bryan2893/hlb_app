import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerEditarTrampaAmarillaPageRoutingModule } from './ver-editar-trampa-amarilla-routing.module';

import { VerEditarTrampaAmarillaPage } from './ver-editar-trampa-amarilla.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VerEditarTrampaAmarillaPageRoutingModule
  ],
  declarations: [VerEditarTrampaAmarillaPage]
})
export class VerEditarTrampaAmarillaPageModule {}
