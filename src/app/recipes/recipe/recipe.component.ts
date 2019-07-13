import { User } from './../../base/user-interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../../base/login.service';
import { RecipeService } from '../recipe.service';
import { RecipeDataService } from '../recipe-data.service';
import { Data, Recipe } from '../recipe-interface';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})

export class RecipeComponent implements OnInit {

  private rate = 0;

  private user: firebase.User;
  private loggedInUserData: User;

  public favourite = false;
  public rateaverage = 0;
  public ratecount = 0;
  public rateUser = 0;

  public loggedInUserId: string;
  public selectedRecipeId: any;

  public recipe: Recipe;
  public recipedata: Data;

  public labelPosition = 'before';

  constructor(
    private loginService: LoginService,
    private recipeService: RecipeService,
    private recipeDataService: RecipeDataService,
    private route: ActivatedRoute,
    public afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.selectedRecipeId = this.route.snapshot.paramMap.get('id');
    this.recipeService.getRecipe(this.selectedRecipeId).subscribe(recipe => {
      this.recipe = recipe;
    });
    this.loginService.getLoggedInUser().subscribe(user => {
      this.user = user;
      if (this.user) {
        this.loggedInUserId = user.uid;
        this.writeOpened();
        this.loginService.getUser(this.loggedInUserId).subscribe(userdata => {
          this.loggedInUserData = userdata;
          if (this.loggedInUserData) {
            const favouriteUser = this.loggedInUserData.favourites.filter(rr => rr.recipeid === this.selectedRecipeId);
            if (favouriteUser.length !== 0) {
              this.favourite = true;
            }
          }
        });
        this.recipeDataService.getRecipeData(this.selectedRecipeId).pipe(take(1)).subscribe(recipedata => {
          this.recipedata = recipedata;
          if (this.recipedata.rate.length > 0) {
            this.ratecount = recipedata.ratecount;
            this.rateaverage = recipedata.rateaverage;
          }
        });
      }
    });
  }

  writeOpened() {
    this.recipeDataService.getRecipeData(this.selectedRecipeId).pipe(take(1)).subscribe(recipedata => {
      this.recipedata = recipedata;
      if (this.recipedata) {
        const writeopened: any = {
          opened: recipedata.opened + 1,
        };
        this.recipeDataService.updateRecipeData(this.selectedRecipeId, writeopened);
      } else {
        const writeopened: any = {
          opened: 1,
          rateaverage: 0,
          ratecount: 0,
          rate: []
        };
        this.recipeDataService.updateRecipeData(this.selectedRecipeId, writeopened);
      }
    });
  }

  toggleFavourites() {
    this.favourite = !this.favourite;
    this.loginService.getUser(this.loggedInUserId).pipe(take(1)).subscribe(userdata => {
      this.loggedInUserData = userdata;
      if (this.loggedInUserData) {
        const favouritesOther = this.loggedInUserData.favourites.filter(rr => rr.recipeid !== this.selectedRecipeId);
        const favouriteUser = this.loggedInUserData.favourites.filter(rr => rr.recipeid === this.selectedRecipeId);
        if (favouriteUser.length === 0) {
          const writefavourite: any = {
            favourites: [{ recipeid: this.selectedRecipeId }, ...favouritesOther]
          };
          this.loginService.updateUser(this.loggedInUserId, writefavourite);
        } else {
          const writefavourite: any = {
            favourites: [...favouritesOther]
          };
          this.loginService.updateUser(this.loggedInUserId, writefavourite);
        }
      }
    });
  }

  toggleRate(data: any) {
    this.rateUser = data.rating;
    if (this.rateUser > 0) {
      this.recipeDataService.getRecipeData(this.selectedRecipeId).pipe(take(1)).subscribe(recipedata => {
        this.recipedata = recipedata;
        const ratesallusers = this.recipedata.rate;
        const otherrates = ratesallusers.filter(sc => sc.uid !== this.loggedInUserId);
        if (otherrates.length > 0) {
          this.ratecount = otherrates.map(sc => sc.score).length + 1;
          this.rateaverage = (otherrates.map(sc => sc.score).reduce((a, b) => a + b) + this.rateUser) / this.ratecount;
          const writerecipedata: any = {
            rateaverage: this.rateaverage,
            ratecount: this.ratecount,
            rate: [{ uid: this.loggedInUserId, score: this.rateUser }, ...otherrates]
          };
          this.recipeDataService.updateRecipeData(this.selectedRecipeId, writerecipedata);
        } else {
          this.rateaverage = this.rateUser;
          this.ratecount = 1;
          const writerecipedata: any = {
            rateaverage: this.rateaverage,
            ratecount: this.ratecount,
            rate: [{ uid: this.loggedInUserId, score: this.rateUser }]
          };
          this.recipeDataService.updateRecipeData(this.selectedRecipeId, writerecipedata);
        }
      });
    }
  }
}
