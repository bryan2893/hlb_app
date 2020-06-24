import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerEditarInspHlbPage } from './ver-editar-insp-hlb.page';

const routes: Routes = [
  {
    path: '',
    component: VerEditarInspHlbPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerEditarInspHlbPageRoutingModule {}
