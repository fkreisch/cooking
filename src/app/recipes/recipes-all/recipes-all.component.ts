import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { RecipeId } from '../recipe-interface';

@Component({
  selector: 'app-recipes-all',
  templateUrl: './recipes-all.component.html',
  styleUrls: ['./recipes-all.component.scss']
})
export class RecipesAllComponent implements OnInit {

  public recipes: RecipeId[];
  public rFilter: string;

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
    });
  }
}
