import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AdminAddRecipeModalPage } from 'src/app/modals/admin-add-recipe-modal/admin-add-recipe-modal.page';
import { AdminUpdateRecipeModalPage } from 'src/app/modals/admin-update-recipe-modal/admin-update-recipe-modal.page';
import { Recipe } from 'src/app/models/recipe.model';
import { NodeJsExpressService } from 'src/app/services/node-js-express-service/node-js-express.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  recipes: Recipe[] = [];

  constructor(
    private modalCtrl: ModalController,
    private nodeJsExpressService: NodeJsExpressService
  ) {}

  ngOnInit() {
    this.getRecipies();
  }

  getRecipies() {
    this.nodeJsExpressService.getAll().subscribe(
      (data) => {
        this.recipes = data;
        console.log(this.recipes);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async create() {
    const modal = await this.modalCtrl.create({
      component: AdminAddRecipeModalPage,
      cssClass: 'admin-modal',
    });

    await modal.present();
  }

  async update(recipe: any) {
    console.log("this is recipe", recipe);
    const modal = await this.modalCtrl.create({
      component: AdminUpdateRecipeModalPage,
      cssClass: 'admin-modal',
      componentProps: {
        'recipe': recipe,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();  // Få det opdaterede recipe objekt
    if (data) {
      const index = this.recipes.findIndex(r => r.id === data.id);  // Find indexet for det opdaterede recipe objekt i recipes arrayet
      this.recipes[index] = data;  // Opdater det relevante objekt i recipes arrayet
    }
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
}
