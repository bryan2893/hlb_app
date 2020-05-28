import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuInspeccionesPageRoutingModule } from './menu-inspecciones-routing.module';

import { MenuInspeccionesPage } from './menu-inspecciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuInspeccionesPageRoutingModule
  ],
  declarations: [MenuInspeccionesPage]
})
export class MenuInspeccionesPageModule {}
