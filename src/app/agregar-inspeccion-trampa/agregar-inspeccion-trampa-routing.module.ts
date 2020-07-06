import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarInspeccionTrampaPage } from './agregar-inspeccion-trampa.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarInspeccionTrampaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarInspeccionTrampaPageRoutingModule {}
