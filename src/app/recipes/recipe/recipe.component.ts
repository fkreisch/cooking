import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../../base/login.service';
import { RecipeService } from '../recipe.service';
import { RecipeRateService } from '../recipe-rate.service';
import { RecipeId, RateId, Rate } from '../recipe-interface';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})

export class RecipeComponent implements OnInit, OnDestroy {
  // Get User ID from browser
  private user: firebase.User;
  public loggedInUserData: any;
  private loggedInUserId: string;
  public loggedInSupervisor = false;

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
    private loginService: LoginService,
    private recipeService: RecipeService,
    private recipeRateService: RecipeRateService,
    private route: ActivatedRoute,
    public afAuth: AngularFireAuth
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
    // Get LoggedInUserData
    this.loginService.getLoggedInUser().pipe(take(1))
      .subscribe(user => {
        this.user = user;
        console.log('null vagy?', this.user);
        if (this.user !== null) {
          this.loginService.getUser(this.user.uid).pipe(take(1))
            .subscribe(uu => {
              this.loggedInUserData = uu;
              this.loggedInUserId = this.loggedInUserData[0].id;
              this.loggedInSupervisor = this.loggedInUserData[0].supervisor;
              // Recipe rating
              this.recipeRateService.getRecipesRates().pipe(take(1))
                .subscribe(recipesrates => {
                  this.recipesrates = recipesrates;
                  this.reciperates = this.recipesrates.filter(reciperates => reciperates.id === this.selectedRecipeId);
                  if (this.reciperates.length > 0) {
                    this.ratesotherusers = this.reciperates[0].rate.filter(rr => rr.uid !== this.loggedInUserId);
                    this.ratesallusers = this.reciperates[0].rate;
                  } else {
                    this.ratesotherusers = [];
                    this.ratesallusers = [];
                  }
                  if (this.ratesallusers.length > 0) {
                    this.rateaverage = this.ratesallusers.map(sc => sc.score).reduce((a, b) => a + b) /
                      this.ratesallusers.map(sc => sc.score).filter(sc => sc > 0).length;
                  }
                  if (this.ratesallusers.filter(sc => sc.uid === this.loggedInUserId).length > 0) {
                    this.rate = this.ratesallusers.filter(sc => sc.uid === this.loggedInUserId).map(sc => sc.score).reduce((a, b) => a + b);
                  }
                });
            });
        }
      });
  }

  ngOnDestroy() {
    this.opened = this.recipe[0].opened + 1;
    const writerecipe: any = {
      favourite: this.favourite,
      opened: this.opened
    };
    this.recipeService.updateRecipe(this.selectedRecipeId, writerecipe);

    // const writerate: any = {
    //   rate: [{ uid: this.loggedInUserId, score: this.rate }, ...this.ratesotherusers]
    // };
    // this.recipeRateService.updateRecipeRate(this.selectedRecipeId, writerate);
  }

  readUser(id: string) {
    this.loginService.getUser(id).pipe(take(1)).subscribe(user => {
      this.loggedInUserData = user;
      this.loggedInUserId = this.loggedInUserData[0].id;
      this.loggedInSupervisor = this.loggedInUserData[0].supervisor;
    });
  }

  toggleFavourites(fav) {
    this.favourite = fav;
  }

  toggleRate(ev) {
    this.rate = ev.rating;
  }
}
