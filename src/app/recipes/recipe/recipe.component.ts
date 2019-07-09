import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { RecipeRateService } from '../recipe-rate.service';
import { RecipeId, RateId, Rate } from '../recipe-interface';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})

export class RecipeComponent implements OnInit, OnDestroy {
  // Get User ID from browser
  public loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  public recipes: RecipeId[];
  public recipe: RecipeId[];
  public recipesrates: RateId[]; // minden rate Id-vel
  public reciperates: RateId[]; // a kiválasztott recepthez tartozó összes rate Id-vel
  public ratesotherusers: any[]; // minden más rate ami nem a belogolt useré
  public ratesallusers: any[]; // minden rate recept Id nélkül.

  public selectedRecipeId: any;
  public favourite: boolean;
  public opened: number;
  public rate = 0;
  public rateaverage = 0;
  labelPosition = 'before';

  constructor(
    private recipeService: RecipeService,
    private recipeRateService: RecipeRateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Get Recipe ID from browser
    this.selectedRecipeId = this.route.snapshot.paramMap.get('id');
    // Recipe
    this.recipeService.getRecipes().pipe(take(1)).subscribe(recipes => {
      this.recipes = recipes;
      this.recipe = this.recipes.filter(recipe => recipe.id === this.selectedRecipeId);
      this.opened = this.recipe[0].opened;
      // Kiszervezni:
      this.favourite = this.recipe[0].favourite;
    });
    // Recipe rating
    this.recipeRateService.getRecipesRates().pipe(take(1)).subscribe(recipesrates => {
      this.recipesrates = recipesrates;
      this.reciperates = this.recipesrates.filter(reciperates => reciperates.id === this.selectedRecipeId);
      if (this.reciperates.length > 0) {
        this.ratesotherusers = this.reciperates[0].rate.filter(rr => rr.uid !== this.loggedInUser.uid);
        this.ratesallusers = this.reciperates[0].rate;
      } else {
        this.ratesotherusers = [];
        this.ratesallusers = [];
      }
      if (this.ratesallusers.length > 0) {
        this.rateaverage = this.ratesallusers.map(sc => sc.score).reduce((a, b) => a + b) /
          this.ratesallusers.map(sc => sc.score).filter(sc => sc > 0).length;
      }
      if (this.ratesallusers.filter(sc => sc.uid === this.loggedInUser.uid).length > 0) {
        this.rate = this.ratesallusers.filter(sc => sc.uid === this.loggedInUser.uid).map(sc => sc.score).reduce((a, b) => a + b);
      }
    });
  }

  ngOnDestroy() {
    this.opened = this.recipe[0].opened + 1;
    const writerecipe: any = {
      favourite: this.favourite,
      opened: this.opened
    };
    const writerate: any = {
      rate: [{ uid: this.loggedInUser.uid, score: this.rate }, ...this.ratesotherusers]
    };
    this.recipeService.updateRecipe(this.selectedRecipeId, writerecipe);
    this.recipeRateService.updateRecipeRate(this.selectedRecipeId, writerate);
  }

  toggleFavourites(fav) {
    this.favourite = fav;
  }

  toggleRate(ev) {
    this.rate = ev.rating;
  }
}