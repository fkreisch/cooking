import { Like } from './../recipe-interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { RecipeId } from '../recipe-interface';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})

export class RecipeComponent implements OnInit, OnDestroy {

  public loggedInUser = localStorage.getItem('loggedInUser');

  public recipes: RecipeId[];
  public recipe: RecipeId[];

  public selectedRecipeId: any;
  public favourite: boolean;
  public opened: number;
  public likes: [Like];
  public like: number;
  public likeaverage: number;

  labelPosition = 'before';
  ertek = 2;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.selectedRecipeId = this.route.snapshot.paramMap.get('id'); // Get ID from browser
    // SUBSCRIBE RECIPE -- ONLY ONCE
    this.recipeService.getRecipes().pipe(take(1)).subscribe(recipes => {
      this.recipes = recipes;
      this.recipe = this.recipes.filter(recipe => recipe.id === this.selectedRecipeId);
      // SUBSCRIBE RECIPE
      // this.recipeService.getRecipes().subscribe(recipes => {
      //   this.recipes = recipes;
      //   this.recipe = this.recipes.filter(recipe => recipe.id === this.selectedRecipeId);
      this.favourite = this.recipe[0].favourite;
      this.opened = this.recipe[0].opened;
      this.likes = this.recipe[0].like;
      const test = this.likes.map(sc => sc.score).reduce((a, b) => a + b);
      const db = this.likes.map(sc => sc.score).filter(sc => sc > 0).length;
      const ll = this.likes.map(sc => sc.id).filter(sci => sci === this.loggedInUser);


      this.likeaverage = test / db;
      console.log('test', ll, 'Sum:', test, 'Db:', db, 'Avg:', this.likeaverage, 'Yours:', this.like);
    });
  }

  ngOnDestroy() {
    this.opened = this.recipe[0].opened + 1;
    const write: any = {
      favourite: this.favourite,
      opened: this.opened,
      // like: [{ id: this.loggedInUser, score: this.like }]
    };
    this.recipeService.updateRecipe(this.selectedRecipeId, write);
  }

  togleFavourites(fav) {
    this.favourite = fav;
  }

  togleLike(lik) {
    this.like = this.likeaverage;

  }
}
