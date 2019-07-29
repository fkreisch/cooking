import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { LoginService } from '../../_services/login.service';
import { RecipeService } from '../../_services/recipe.service';
import { Recipe } from '../../_interfaces/interface';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackComponent } from '../../base/snack/snack.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})

export class RecipeComponent implements OnInit {

  private rate = 0;
  private favourites: Recipe['favourites'];

  public favourite = false;
  public sendingDate: any;
  public rateaverage = 0;
  public ratecount = 0;
  public rateUser = 0;

  public comment: string;
  public comments: Recipe['comments'];

  private user: firebase.User;
  public loggedInUserId: string;
  public loggedInUserData: any;
  public selectedRecipeId: any;

  public recipe: Recipe;

  public labelPosition = 'before';

  constructor(
    private loginService: LoginService,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public afAuth: AngularFireAuth,
    private ngZone: NgZone
  ) { }

  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  triggerResize() {
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  openSnackBar(message: string) {
    this.snackBar.openFromComponent(SnackComponent, {
      duration: 3000,
      data: message
    });
  }

  ngOnInit() {
    this.selectedRecipeId = this.route.snapshot.paramMap.get('id');
    this.recipeService.getRecipe(this.selectedRecipeId).subscribe(recipe => {
      if (!recipe) { return; }
      this.recipe = recipe;
      this.sendingDate = recipe.sendingDate.seconds * 1000;
      this.favourites = this.recipe.favourites;
      const isFavourite = this.recipe.favourites.filter(rr => rr.uid === this.loggedInUserId);
      if (isFavourite.length !== 0) {
        this.favourite = true;
      }
      this.ratecount = recipe.ratecount;
      this.rateaverage = recipe.rateaverage;
      this.comments = recipe.comments;
    });
    this.loginService.getLoggedInUser().subscribe(user => {
      this.user = user;
      if (!this.user) { return; }
      this.loggedInUserId = user.uid;
      this.loggedInUserData = user;
    });
    this.writeOpened();
  }

  writeOpened() {
    this.recipeService.getRecipe(this.selectedRecipeId).pipe(take(1)).subscribe(recipe => {
      this.recipe = recipe;
      if (this.recipe) {
        const writeopened: any = {
          opened: recipe.opened + 1,
        };
        this.recipeService.updateRecipe(this.selectedRecipeId, writeopened);
      } else {
        const writeopened: any = {
          opened: 1,
          rateaverage: 0,
          ratecount: 0,
          rate: [],
          comments: []
        };
        this.recipeService.updateRecipe(this.selectedRecipeId, writeopened);
      }
    });
  }

  toggleFavourites() {
    this.favourite = !this.favourite;
    this.recipeService.getRecipe(this.selectedRecipeId).pipe(take(1)).subscribe(recipe => {
      this.favourites = recipe.favourites;
      const favouritesOther = this.favourites.filter(sc => sc.uid !== this.loggedInUserId);
      if (this.favourite) {
        const writefavourite: any = {
          favourites: [{ uid: this.loggedInUserId }, ...favouritesOther]
        };
        this.recipeService.updateRecipe(this.selectedRecipeId, writefavourite);
        this.openSnackBar('A recept sikeresen bekerült a kedvencid közé.');
      } else {
        const writefavourite: any = {
          favourites: [...favouritesOther]
        };
        this.recipeService.updateRecipe(this.selectedRecipeId, writefavourite);
        this.openSnackBar('A receptet sikeresen eltávolítottad a kedvenceid közül.');
      }
    });
  }

  toggleRate(data: any) {
    this.rateUser = data.rating;
    if (this.rateUser > 0) {
      this.recipeService.getRecipe(this.selectedRecipeId).pipe(take(1)).subscribe(recipe => {
        this.recipe = recipe;
        const ratesallusers = this.recipe.rate;
        const otherrates = ratesallusers.filter(sc => sc.uid !== this.loggedInUserId);
        if (otherrates.length > 0) {
          this.ratecount = otherrates.map(sc => sc.score).length + 1;
          this.rateaverage = (otherrates.map(sc => sc.score).reduce((a, b) => a + b) + this.rateUser) / this.ratecount;
          const writerecipe: any = {
            rateaverage: this.rateaverage,
            ratecount: this.ratecount,
            rate: [{ uid: this.loggedInUserId, score: this.rateUser }, ...otherrates]
          };
          this.recipeService.updateRecipe(this.selectedRecipeId, writerecipe);
        } else {
          this.rateaverage = this.rateUser;
          this.ratecount = 1;
          const writerecipe: any = {
            rateaverage: this.rateaverage,
            ratecount: this.ratecount,
            rate: [{ uid: this.loggedInUserId, score: this.rateUser }]
          };
          this.recipeService.updateRecipe(this.selectedRecipeId, writerecipe);
        }
      });
    }
  }

  addComment() {
    const writerecipecomment: any = {
      comments: [{
        uid: this.loggedInUserId,
        name: this.loggedInUserData.displayName,
        photoURL: this.loggedInUserData.photoURL,
        commentdate: new Date(),
        comment: this.comment,
      }, ...this.comments]
    };
    this.recipeService.updateRecipe(this.selectedRecipeId, writerecipecomment);
    this.comment = null;
  }
}
