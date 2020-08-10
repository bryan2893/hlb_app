import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DistritosPageRoutingModule } from './distritos-routing.module';

import { DistritosPage } from './distritos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DistritosPageRoutingModule
  ],
  declarations: [DistritosPage]
})
export class DistritosPageModule {}
