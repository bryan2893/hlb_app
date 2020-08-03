import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DistritosPage } from './distritos.page';

const routes: Routes = [
  {
    path: '',
    component: DistritosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistritosPageRoutingModule {}
