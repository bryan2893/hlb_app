import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusquedaTraspatiosGpsPage } from './busqueda-traspatios-gps.page';

const routes: Routes = [
  {
    path: '',
    component: BusquedaTraspatiosGpsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusquedaTraspatiosGpsPageRoutingModule {}
