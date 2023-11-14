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
  ingredientInput: string = '';
  addedIngredients: string[] = [];
  isSearchBarFocused = false;
  recipe: Recipe;
  recipes: Recipe[] = [];
  imageUrl!: string;

  constructor(
    private modalCtrl: ModalController,
    private nodeJsExpressService: NodeJsExpressService,
    private toastController: ToastController
  ) {
    this.recipe = new Recipe();
  }

  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async openGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    if (image.dataUrl) {
      const response = await fetch(image.dataUrl);
      const blob = await response.blob();
      this.imageUrl = URL.createObjectURL(blob);
      this.recipe.image = blob;
    }
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
    this.recipe.ingredientsWithMeasurements = this.addedIngredients.join(', ');
    this.nodeJsExpressService.create(this.recipe).subscribe(
      (data) => {
        this.recipe = data;
        this.showToast('Recipe added successfully');
        this.modalCtrl.dismiss(this.recipe);
      },
      (error) => {
        console.log(error);
        this.showToast('An error occurred when trying to add a new recipe');
      }
    );
  }
}