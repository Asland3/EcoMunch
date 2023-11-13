import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';

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
  imageUrl: string | undefined;
  ingredientInput: string = '';
  addedIngredients: string[] = [];
  isSearchBarFocused = false;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

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
    this.imageUrl = 'data:image/jpeg;base64,' + image.base64String;
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
    this.modalCtrl.dismiss();
  }
}
