import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerEditarTraspatioFincaPage } from './ver-editar-traspatio-finca.page';

const routes: Routes = [
  {
    path: '',
    component: VerEditarTraspatioFincaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerEditarTraspatioFincaPageRoutingModule {}
