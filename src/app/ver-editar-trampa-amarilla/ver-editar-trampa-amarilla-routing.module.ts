import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerEditarTrampaAmarillaPage } from './ver-editar-trampa-amarilla.page';

const routes: Routes = [
  {
    path: '',
    component: VerEditarTrampaAmarillaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerEditarTrampaAmarillaPageRoutingModule {}
