import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LotesPropietariosPage } from './lotes-propietarios.page';

const routes: Routes = [
  {
    path: '',
    component: LotesPropietariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LotesPropietariosPageRoutingModule {}
