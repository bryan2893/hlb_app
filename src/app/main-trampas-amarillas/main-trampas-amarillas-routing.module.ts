import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainTrampasAmarillasPage } from './main-trampas-amarillas.page';

const routes: Routes = [
  {
    path: '',
    component: MainTrampasAmarillasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainTrampasAmarillasPageRoutingModule {}
