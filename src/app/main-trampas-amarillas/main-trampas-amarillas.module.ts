import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainTrampasAmarillasPageRoutingModule } from './main-trampas-amarillas-routing.module';

import { MainTrampasAmarillasPage } from './main-trampas-amarillas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainTrampasAmarillasPageRoutingModule
  ],
  declarations: [MainTrampasAmarillasPage]
})
export class MainTrampasAmarillasPageModule {}
