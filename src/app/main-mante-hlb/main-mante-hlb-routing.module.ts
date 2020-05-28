import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainManteHlbPage } from './main-mante-hlb.page';

const routes: Routes = [
  {
    path: '',
    component: MainManteHlbPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainManteHlbPageRoutingModule {}
