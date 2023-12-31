import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private apiKey = '9973533';

  constructor(private http: HttpClient) {}

  // API returns ingredients as seperate properties therfor this function to loop through them
  getIngredients(meal: any) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (
        meal['strIngredient' + i] &&
        meal['strIngredient' + i].trim() !== ''
      ) {
        ingredients.push(meal['strIngredient' + i]);
      }
    }
    return ingredients;
  }

  // API returns measurements as seperate properties therfor this function to loop through them
  getMeasurements(meal: any) {
    let measurement = [];
    for (let i = 1; i <= 20; i++) {
      if (meal['strMeasure' + i]) {
        measurement.push(meal['strMeasure' + i]);
      }
    }
    return measurement;
  }

  async getRecipieByIngredients(ingredients: string[]) {
    try {
      const ingredientString = ingredients.join(',');
      const response$ = this.http.get(
        `https://www.themealdb.com/api/json/v2/${this.apiKey}/filter.php?i=${ingredientString}`
      );
      const response: any = await lastValueFrom(response$);
      const meals: any[] = response['meals'];
  
      if (!meals) {
        throw new Error('No meals found for the given ingredients');
      }
  
      const bestMatches = await this.getBestMatchRecipes(meals, ingredients);
  
      return bestMatches;
    } catch (error: any) {
      console.log('Error:', error.message);
      throw error;
    }
  }
  

  async getBestMatchRecipes(
    meals: any[],
    ingredients: string[]
  ): Promise<any[]> {
    let mealsWithMissingIngredientsCount: any[] = [];

    for (const meal of meals) {
      const fullMeal = await this.getMealById(meal.idMeal);
      const mealIngredients = this.getIngredients(fullMeal);
      let missingIngredientsCount = 0;

      for (const ingredient of mealIngredients) {
        if (!ingredients.includes(ingredient)) {
          missingIngredientsCount++;
        }
      }

      mealsWithMissingIngredientsCount.push({
        ...fullMeal,
        missingIngredientsCount,
        totalIngredients: mealIngredients.length,
      });
    }

    mealsWithMissingIngredientsCount.sort(
      (a: any, b: any) => a.missingIngredientsCount - b.missingIngredientsCount
    );

    return mealsWithMissingIngredientsCount.slice(0, 10);
  }

  async getMealById(id: string) {
    try {
      const response$ = this.http.get(
        `https://www.themealdb.com/api/json/v2/${this.apiKey}/lookup.php?i=${id}`
      );
      const response: any = await lastValueFrom(response$);
      return response.meals[0];
    } catch (error) {
      console.log('Error during getMealById: ', error);
      throw new Error('Failed to fetch meal. Please try again.');
    }
  }

  async getLatestMeal() {
    try {
      const response$ = this.http.get(
        `https://www.themealdb.com/api/json/v2/${this.apiKey}/latest.php`
      );
      const response: any = await lastValueFrom(response$);
      return response.meals[0];
    } catch (error) {
      console.log('Error during getLatestMeal: ', error);
      throw new Error('Failed to fetch meal. Please try again.');
    }
  }

  async getRandomMeals() {
    try {
      const response$ = this.http.get(
        `https://www.themealdb.com/api/json/v2/${this.apiKey}/randomselection.php`
      );
      const response: any = await lastValueFrom(response$);
      return response.meals;
    } catch (error) {
      console.log('Error during randomMeals: ', error);
      throw new Error('Failed to fetch meals. Please try again.');
    }
  }
  
}
