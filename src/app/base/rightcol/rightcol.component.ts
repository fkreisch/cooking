import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../_services/recipe.service';
import { LoginService } from './../../_services/login.service';
import { RecipeId } from '../../_interfaces/interface';

@Component({
  selector: 'app-rightcol',
  templateUrl: './rightcol.component.html',
  styleUrls: ['./rightcol.component.scss']
})
export class RightcolComponent implements OnInit {

  public recipes: RecipeId[];
  private user: firebase.User;
  public loggedInUserId: string;
  public loggedInUserData: any;
  public allRecipesCount: number;
  public myRecipesCount: number;

  constructor(private recipeService: RecipeService, private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.getLoggedInUser().subscribe(user => {
      this.user = user;
      if (!this.user) { return; }
      this.loggedInUserId = user.uid;
      this.loggedInUserData = user;
      this.recipeService.getMyRecipes(this.loggedInUserId).subscribe(recipes => {
        this.myRecipesCount = recipes.length;
        if (!this.myRecipesCount) { return; }
      });
    });
    this.recipeService.getSharedRecipes().subscribe(recipes => {
      this.recipes = recipes;
      this.allRecipesCount = this.recipes.length;
      if (!this.recipes) { return; }
    });
  }

}
