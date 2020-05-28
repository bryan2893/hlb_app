import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FincasPobladosPageRoutingModule } from './fincas-poblados-routing.module';

import { FincasPobladosPage } from './fincas-poblados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FincasPobladosPageRoutingModule
  ],
  declarations: [FincasPobladosPage]
})
export class FincasPobladosPageModule {}
