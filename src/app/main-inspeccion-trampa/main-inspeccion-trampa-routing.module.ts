import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainInspeccionTrampaPage } from './main-inspeccion-trampa.page';

const routes: Routes = [
  {
    path: '',
    component: MainInspeccionTrampaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainInspeccionTrampaPageRoutingModule {}
