import { User } from './../../base/user-interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../../base/login.service';
import { RecipeService } from '../recipe.service';
import { RecipeRateService } from '../recipe-rate.service';
import { Rate, Recipe } from '../recipe-interface';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})

export class RecipeComponent implements OnInit, OnDestroy {
  // User variables
  private user: firebase.User;
  private loggedInUserData: User;
  private loggedInUserFavourites: [];

  // Recipe variables
  private reciperates: Rate;
  private ratesotherusers: any;
  private loggedInUserFavouritesOther: any;
  private loggedInUserFavouritesThis: any;

  // page variables
  public loggedInUserId: string;
  public selectedRecipeId: any;
  public recipe: Recipe;
  public favourite = false;
  public opened: number;
  public rate = 0;
  public rateaverage = 0;
  public labelPosition = 'before';

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
    this.recipeService.getRecipe(this.selectedRecipeId).subscribe(recipe => {
      this.recipe = recipe;
      this.opened = this.recipe.opened;
    });
    // for now all things for registered users only.
    this.loginService.getLoggedInUser().subscribe(user => {
      this.user = user;
      if (this.user) {
        this.loggedInUserId = user.uid;
        this.loginService.getUser(this.user.uid).subscribe(udata => {
          this.loggedInUserData = udata;
          // Favourite display
          this.loggedInUserFavouritesOther = this.loggedInUserData.favourites.filter(rr => rr.recipeid !== this.selectedRecipeId);
          this.loggedInUserFavouritesThis = this.loggedInUserData.favourites.filter(rr => rr.recipeid === this.selectedRecipeId);
          if (this.loggedInUserFavouritesThis.length !== 0) {
            this.toggleFavourites();
          }
          // Recipe rating display
          this.recipeRateService.getRecipeRates(this.selectedRecipeId).subscribe(recipesrates => {
            this.reciperates = recipesrates;
            if (this.reciperates) {
              this.ratesotherusers = this.reciperates.rate.filter(rr => rr.uid !== this.loggedInUserId);
              const ratesallusers = this.reciperates.rate;
              this.rateaverage = ratesallusers.map(sc => sc.score).reduce((a, b) => a + b) /
                ratesallusers.map(sc => sc.score).length;
              if (ratesallusers.filter(sc => sc.uid === this.loggedInUserId).length > 0) {
                this.rate = ratesallusers.filter(sc => sc.uid === this.loggedInUserId).map(sc => sc.score).reduce((a, b) => a + b);
              }
            }
          });
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.loggedInUserId) {
      this.opened = this.recipe.opened + 1;
      const writerecipe: any = {
        opened: this.opened
      };
      const writerate: any = {
        rate: [{ uid: this.loggedInUserId, score: this.rate }, ...this.ratesotherusers]
      };
      if (this.favourite) {
        const writefavourite: any = {
          favourites: [{ recipeid: this.selectedRecipeId }, ...this.loggedInUserFavouritesOther]
        };
        this.loginService.updateUser(this.loggedInUserId, writefavourite);
      } else {
        const writefavourite: any = {
          favourites: [...this.loggedInUserFavouritesOther]
        };
        this.loginService.updateUser(this.loggedInUserId, writefavourite);
      }
      this.recipeService.updateRecipe(this.selectedRecipeId, writerecipe);
      this.recipeRateService.updateRecipeRate(this.selectedRecipeId, writerate);
    }
  }

  toggleFavourites() {
    this.favourite = !this.favourite;
  }

  toggleRate(ev: any) {
    this.rate = ev.rating;
  }
}
