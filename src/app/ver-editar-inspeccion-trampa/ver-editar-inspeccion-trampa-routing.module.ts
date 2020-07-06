import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerEditarInspeccionTrampaPage } from './ver-editar-inspeccion-trampa.page';

const routes: Routes = [
  {
    path: '',
    component: VerEditarInspeccionTrampaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerEditarInspeccionTrampaPageRoutingModule {}
