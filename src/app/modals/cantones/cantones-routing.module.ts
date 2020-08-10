import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CantonesPage } from './cantones.page';

const routes: Routes = [
  {
    path: '',
    component: CantonesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CantonesPageRoutingModule {}
