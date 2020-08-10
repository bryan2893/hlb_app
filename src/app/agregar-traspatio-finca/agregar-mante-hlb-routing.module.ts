import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarManteHlbPage } from './agregar-mante-hlb.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarManteHlbPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarManteHlbPageRoutingModule {}
