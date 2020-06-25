import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerEditarInspeccionHlbPage } from './ver-editar-inspeccion-hlb.page';

const routes: Routes = [
  {
    path: '',
    component: VerEditarInspeccionHlbPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerEditarInspeccionHlbPageRoutingModule {}
