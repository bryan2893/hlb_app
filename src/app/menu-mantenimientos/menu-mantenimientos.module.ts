import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuMantenimientosPageRoutingModule } from './menu-mantenimientos-routing.module';

import { MenuMantenimientosPage } from './menu-mantenimientos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuMantenimientosPageRoutingModule
  ],
  declarations: [MenuMantenimientosPage]
})
export class MenuMantenimientosPageModule {}
