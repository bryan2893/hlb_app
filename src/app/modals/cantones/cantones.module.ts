import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CantonesPageRoutingModule } from './cantones-routing.module';

import { CantonesPage } from './cantones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CantonesPageRoutingModule
  ],
  declarations: [CantonesPage]
})
export class CantonesPageModule {}
