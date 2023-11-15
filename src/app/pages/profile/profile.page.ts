import { Component } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { LogoutConfirmationModalPage } from '../../modals/logout-confirmation-modal/logout-confirmation-modal.page';
import { UpdateUserModalPage } from '../../modals/update-user-modal/update-user-modal.page';
import { AuthService } from '../../services/auth-service/auth.service';
import { UserService } from '../../services/user-service/user.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DishDetailsModalPage } from 'src/app/modals/dish-details-modal/dish-details-modal.page';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  animations: [
    trigger('fadeOutIn', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('600ms ease-in-out')),
    ]),
  ],
})
export class ProfilePage {
  user: any;
  favorites: any[] = [];
  favoriteStatus: { [key: string]: boolean } = {}; 
  categories: any[] = [];
  isLoadingFavorites: boolean = true;


  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private userService: UserService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(async (user) => {
      this.user = user;
      if (user) {
        await this.getFavorites();
      }
    });
    this.authService.updateUserData();
  }

  navigateAdmin() {
    this.navCtrl.navigateForward('/tabs/home/profile/admin');
  }

  async getFavorites() {
    if (this.user) {
      this.favorites = await this.userService.getFavorites(this.user.uid);
      this.isFavorite();
      this.isLoadingFavorites = false;
    }
  }

  async logout() {
    const modal = await this.modalCtrl.create({
      component: LogoutConfirmationModalPage, 
      cssClass: 'my-modal',
    });
    await modal.present();
  }

  async dishDetailsModal(meal: any) {
    const modal = await this.modalCtrl.create({
      component: DishDetailsModalPage,
      cssClass: 'dish-detail-modal',
      componentProps: {
        'meal': meal
      }
    });
  
    modal.onDidDismiss().then(() => {
      this.getFavorites();
    });
  
    await modal.present();
  }

  async updateUser() {
    const modal = await this.modalCtrl.create({
      component: UpdateUserModalPage,
      breakpoints: [0, 0.3, 0.65, 0.8],
      initialBreakpoint: 0.65,
      componentProps: { user: this.user },
      presentingElement: await this.modalCtrl.getTop(), // This is necessary for the swipe to close feature to work correctly
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      await this.authService.updateUserData();
    }
  }

  async addFavorite(meal: any) {
    await this.userService.addToFavorites(this.user.uid, meal.idMeal);
    this.favoriteStatus[meal.idMeal] = true;
    this.presentToast('Removed from favorites');
  }

  async removeFavorite(meal: any) {
    await this.userService.removeFromFavorites(this.user.uid, meal.idMeal);
    this.favoriteStatus[meal.idMeal] = false;
    meal.removed = true; 
    setTimeout(() => {
      this.favorites = this.favorites.filter(favorite => favorite.idMeal !== meal.idMeal);
    }, 1000); 
    this.presentToast('Removed from favorites');
  }
  
  isFavorite() {
    this.favorites.forEach(async (meal) => {
      const isFavorite = await this.userService.isFavorite(this.user.uid, meal.idMeal);
      this.favoriteStatus[meal.idMeal] = isFavorite;
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  truncateMealName(mealName: string, maxNameLength: number, maxWordLength: number) {
    let words = mealName.split(' ');
    words = words.map(word => {
      if (word.length > maxWordLength) {
        return word.substring(0, maxWordLength) + '...';
      } else {
        return word;
      }
    });
    let truncatedName = words.join(' ');
    if (truncatedName.length > maxNameLength) {
      return truncatedName.substring(0, maxNameLength) + '...';
    } else {
      return truncatedName;
    }
  }

  getCategoryIcon(strCategory: string) {
    if (strCategory === 'Beef') {
      return 'assets/icon/cow.svg';
    } else if (strCategory === 'Breakfast') {
      return 'assets/icon/breakfast.svg';
    } else if (strCategory === 'Chicken') {
      return 'assets/icon/chicken.svg';
    } else if (strCategory === 'Dessert') {
      return 'assets/icon/dessert.svg';
    }else if (strCategory === 'Goat') {
      return 'assets/icon/goat.svg';
    }else if (strCategory === 'Lamb') {
      return 'assets/icon/lamb.svg';
    }else if (strCategory === 'Miscellaneous') {
      return 'assets/icon/miscellaneous.svg';
    }else if (strCategory === 'Pasta') {
      return 'assets/icon/pasta.svg';
    }else if (strCategory === 'Pork') {
      return 'assets/icon/pig.svg';
    }else if (strCategory === 'Seafood') {
      return 'assets/icon/seafood.svg';
    }else if (strCategory === 'Side') {
      return 'assets/icon/miscellaneous.svg';
    }else if (strCategory === 'Starter') {
      return 'assets/icon/miscellaneous.svg';
    }else if (strCategory === 'Vegan') {
      return 'assets/icon/leaf.svg';
    }else if (strCategory === 'Vegetarian') {
      return 'assets/icon/leaf.svg';
    }
   
    return 'assets/icon/miscellaneous.svg';
  }
}
