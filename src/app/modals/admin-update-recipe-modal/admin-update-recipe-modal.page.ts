import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { NodeJsExpressService } from 'src/app/services/node-js-express-service/node-js-express.service';

@Component({
  selector: 'app-admin-update-recipe-modal',
  templateUrl: './admin-update-recipe-modal.page.html',
  styleUrls: ['./admin-update-recipe-modal.page.scss'],
  animations: [
    trigger('fadeOutIn', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('400ms ease-in-out')),
    ]),
  ],
})
export class AdminUpdateRecipeModalPage implements OnInit {
  @Input() recipe: any;
  editedRecipe: any;
  imageUrl: string | undefined;
  ingredientInput: string = '';
  addedIngredients: string[] = [];
  isSearchBarFocused = false;

  constructor(
    private modalCtrl: ModalController,
    private nodeJsExpressService: NodeJsExpressService
  ) {}

  ngOnInit() {
    this.editedRecipe = { ...this.recipe };
      this.editedRecipe.ingredientsWithMeasurements = this.editedRecipe.ingredientsWithMeasurements.split(", ");
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
    this.editedRecipe.image = 'data:image/jpeg;base64,' + image.base64String;
  }

  onSearchBarFocus() {
    this.isSearchBarFocused = true;
  }

  addIngredient() {
    this.editedRecipe.ingredientsWithMeasurements.push(this.ingredientInput);
    this.ingredientInput = '';
  }

  removeIngredient(index: number) {
    this.editedRecipe.ingredientsWithMeasurements.splice(index, 1);
  }

  updateRecipe() {
    // Convert array of ingredients to a string
    this.editedRecipe.ingredientsWithMeasurements =
      this.editedRecipe.ingredientsWithMeasurements.join(', ');

    this.recipe = this.editedRecipe;
    this.nodeJsExpressService.update(this.recipe.id, this.recipe).subscribe(
      (data) => {
        console.log('Recipe updated successfully');
      },
      (error) => {
        console.log(error);
      }
    );
    this.modalCtrl.dismiss(this.recipe);
  }
}
