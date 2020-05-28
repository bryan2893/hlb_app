import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuMantenimientosPage } from './menu-mantenimientos.page';

const routes: Routes = [
  {
    path: '',
    component: MenuMantenimientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuMantenimientosPageRoutingModule {}
