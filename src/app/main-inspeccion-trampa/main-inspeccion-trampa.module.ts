import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainInspeccionTrampaPageRoutingModule } from './main-inspeccion-trampa-routing.module';

import { MainInspeccionTrampaPage } from './main-inspeccion-trampa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainInspeccionTrampaPageRoutingModule
  ],
  declarations: [MainInspeccionTrampaPage]
})
export class MainInspeccionTrampaPageModule {}
