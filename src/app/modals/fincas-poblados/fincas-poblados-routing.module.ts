import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FincasPobladosPage } from './fincas-poblados.page';

const routes: Routes = [
  {
    path: '',
    component: FincasPobladosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FincasPobladosPageRoutingModule {}
