import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../_services/recipe.service';
import { RecipeId } from '../../_interfaces/interface';

@Component({
  selector: 'app-rightcol',
  templateUrl: './rightcol.component.html',
  styleUrls: ['./rightcol.component.scss']
})
export class RightcolComponent implements OnInit {

  public recipes: RecipeId[];

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.recipeService.getSharedRecipes().subscribe(recipes => {
      this.recipes = recipes;
      if (!this.recipes) { return; }
    });
  }

}
