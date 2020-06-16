import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainInspeccionHlbPage } from './main-inspeccion-hlb.page';

const routes: Routes = [
  {
    path: '',
    component: MainInspeccionHlbPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainInspeccionHlbPageRoutingModule {}
