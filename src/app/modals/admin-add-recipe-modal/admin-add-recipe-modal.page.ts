import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ModalController, ToastController } from '@ionic/angular';
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
  recipes: Recipe[] = [];

  constructor(
    private modalCtrl: ModalController,
    private nodeJsExpressService: NodeJsExpressService,
    private toastController: ToastController
  ) {
    this.recipe = new Recipe();
  }

  ngOnInit() {
    this.recipe = new Recipe();
    this.refreshRecipes();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async openGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });
    this.recipe.image = image.webPath;
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

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  addNewRecipe() {
    this.nodeJsExpressService.create(this.recipe).subscribe(
      (data) => {
        this.showToast('Recipe added successfully');
        this.refreshRecipes();
      },
      (error) => {
        console.log(error);
        this.showToast('An error occurred when trying to add a new recipe');
      }
    );
    this.modalCtrl.dismiss(this.recipe);
  }

  refreshRecipes() {
    this.nodeJsExpressService.getAll().subscribe(
      (data) => {
        this.recipes = data; 
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
