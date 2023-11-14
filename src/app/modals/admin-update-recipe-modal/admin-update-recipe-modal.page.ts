import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
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
    private nodeJsExpressService: NodeJsExpressService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.editedRecipe = { ...this.recipe };
    this.editedRecipe.ingredientsWithMeasurements =
      this.editedRecipe.ingredientsWithMeasurements.split(', ');
  }
  
  async presentDeleteConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm deletion',
      message: 'Are you sure you want to delete this recipe?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteRecipe();
          },
        },
      ],
    });

    await alert.present();
  }

  deleteRecipe() {
    this.nodeJsExpressService.delete(this.recipe.id).subscribe(
      () => {
        this.showToastSucces('Recipe deleted successfully');
        this.modalCtrl.dismiss({ deleted: true });
      },
      (error) => {
        console.log(error);
        this.showToastError('Error deleting recipe');
      }
    );
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
    this.editedRecipe.image = image.webPath;
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

  async showToastSucces(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  async showToastError(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  updateRecipe() {
    // Convert array of ingredients to a string
    this.editedRecipe.ingredientsWithMeasurements =
      this.editedRecipe.ingredientsWithMeasurements.join(', ');

    this.recipe = this.editedRecipe;
    this.nodeJsExpressService.update(this.recipe.id, this.recipe).subscribe(
      () => {
        this.showToastSucces('Recipe updated successfully');
      },
      (error) => {
        console.log(error);
        this.showToastError('Error updating recipe');
      }
    );
    this.modalCtrl.dismiss(this.recipe);
  }
}
