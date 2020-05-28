import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuInspeccionesPage } from './menu-inspecciones.page';

const routes: Routes = [
  {
    path: '',
    component: MenuInspeccionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuInspeccionesPageRoutingModule {}
