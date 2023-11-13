import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NodeJsExpressService } from 'src/app/services/node-js-express-service/node-js-express.service';
import { Recipe } from 'src/app/models/recipe.model';

@Component({
  selector: 'app-admin-add-recipe-modal',
  templateUrl: './admin-add-recipe-modal.page.html',
  styleUrls: ['./admin-add-recipe-modal.page.scss'],
  animations: [
    trigger('fadeOutIn', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('400ms ease-in-out')),
    ]),
  ],
})
export class AdminAddRecipeModalPage implements OnInit {
  imageUrl: string | undefined;
  ingredientInput: string = '';
  addedIngredients: string[] = [];
  isSearchBarFocused = false;
  recipe: Recipe;

  constructor(
    private modalCtrl: ModalController,
    private nodeJsExpressService: NodeJsExpressService
  ) {
    this.recipe = new Recipe();
  }

  ngOnInit() {
    this.recipe = new Recipe();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async openGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    this.recipe.image = 'data:image/jpeg;base64,' + image.base64String;
  }

  onSearchBarFocus() {
    this.isSearchBarFocused = true;
  }

  addIngredient() {
    this.addedIngredients.push(this.ingredientInput);
    this.ingredientInput = '';
  }

  removeIngredient(index: number) {
    this.addedIngredients.splice(index, 1);
  }

  addNewRecipe() {
    this.nodeJsExpressService.create(this.recipe).subscribe(
      (data) => {
        console.log('Recipe added successfully');
      },
      (error) => {
        console.log(error);
      }
    );
    this.modalCtrl.dismiss();
  }
}
