import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatedDishDetailsModalPageRoutingModule } from './created-dish-details-modal-routing.module';

import { CreatedDishDetailsModalPage } from './created-dish-details-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatedDishDetailsModalPageRoutingModule
  ],
  declarations: [CreatedDishDetailsModalPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreatedDishDetailsModalPageModule {}
