import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { MealService } from 'src/app/services/meal-service/meal.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-created-dish-details-modal',
  templateUrl: './created-dish-details-modal.page.html',
  styleUrls: ['./created-dish-details-modal.page.scss'],
})
export class CreatedDishDetailsModalPage implements OnInit {

  @Input() recipe: any;
  
  constructor(
    private mealService: MealService,
    private modalCtrl: ModalController,
    private userService: UserService,
    private toastController: ToastController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log(this.recipe);
  }


  closeModal() {
    this.modalCtrl.dismiss();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  getCategoryIcon(category: string | undefined) {
    if (category === 'Beef') {
      return 'assets/icon/cow.svg';
    } else if (category === 'Breakfast') {
      return 'assets/icon/breakfast.svg';
    } else if (category === 'Chicken') {
      return 'assets/icon/chicken.svg';
    } else if (category === 'Dessert') {
      return 'assets/icon/dessert.svg';
    } else if (category === 'Goat') {
      return 'assets/icon/goat.svg';
    } else if (category === 'Lamb') {
      return 'assets/icon/lamb.svg';
    } else if (category === 'Miscellaneous') {
      return 'assets/icon/miscellaneous.svg';
    } else if (category === 'Pasta') {
      return 'assets/icon/pasta.svg';
    } else if (category === 'Pork') {
      return 'assets/icon/pig.svg';
    } else if (category === 'Seafood') {
      return 'assets/icon/seafood.svg';
    } else if (category === 'Side') {
      return 'assets/icon/miscellaneous.svg';
    } else if (category === 'Starter') {
      return 'assets/icon/miscellaneous.svg';
    } else if (category === 'Vegan') {
      return 'assets/icon/leaf.svg';
    } else if (category === 'Vegetarian') {
      return 'assets/icon/leaf.svg';
    }

    return 'assets/icon/miscellaneous.svg';
  }

  formatInstructions(instructions: string) {
    return instructions.replace(/\. /g, '.<br><br>');
  }
}