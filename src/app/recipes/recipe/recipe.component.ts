import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { RecipeId } from '../recipe-interface';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})

export class RecipeComponent implements OnInit {

  public recipes: RecipeId[];
  public recipe: RecipeId[];
  public selectedRecipeId: string;
  labelPosition = 'before';
  ertek = 2;
  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.selectedRecipeId = this.route.snapshot.paramMap.get('id'); // Get ID from browser
    this.recipeService.getRecipes().pipe(take(1)).subscribe(recipes => { // subscribe only once
      this.recipes = recipes;
      this.recipe = this.recipes.filter(recipe => recipe.id === this.selectedRecipeId); // only the selected recipe is in
      const opened = { opened: this.recipe[0].opened + 1 }; // Get opened number
      this.writeOpened(this.selectedRecipeId, opened); // Write back opened number
    });
  }

  writeOpened(selectedRecipeId, opened) {
    this.recipeService.updateRecipe(selectedRecipeId, opened);
  }

  togleFavourites(selectedRecipeId, fav) {
    const favourite: any = { favourite: fav };
    this.recipeService.updateRecipe(selectedRecipeId, favourite);
    this.recipe[0].favourite = fav;
  }
}
