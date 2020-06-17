import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarInspeccionHlbPage } from './agregar-inspeccion-hlb.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarInspeccionHlbPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarInspeccionHlbPageRoutingModule {}
