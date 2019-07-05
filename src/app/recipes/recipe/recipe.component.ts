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

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.selectedRecipeId = this.route.snapshot.paramMap.get('id');
    this.recipeService.getRecipes().pipe(take(1)).subscribe(recipes => {
      this.recipes = recipes;
      this.recipe = this.recipes.filter(recipe => recipe.id === this.selectedRecipeId);
      const opened = { opened: this.recipe[0].opened + 1 };
      this.writeOpened(this.selectedRecipeId, opened);
    });
  }

  writeOpened(selectedRecipeId, opened) {
    this.recipeService.updateRecipe(selectedRecipeId, opened);
  }
}
