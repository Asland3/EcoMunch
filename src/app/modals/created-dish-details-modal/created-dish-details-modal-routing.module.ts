import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatedDishDetailsModalPage } from './created-dish-details-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CreatedDishDetailsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatedDishDetailsModalPageRoutingModule {}
