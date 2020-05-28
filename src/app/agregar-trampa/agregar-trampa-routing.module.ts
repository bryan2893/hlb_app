import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarTrampaPage } from './agregar-trampa.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarTrampaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarTrampaPageRoutingModule {}
