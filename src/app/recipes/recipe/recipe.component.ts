import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { LoginService } from '../../_services/login.service';
import { UserService } from '../../_services/user.service';
import { RecipeService } from '../../_services/recipe.service';
import { RecipeDataService } from '../../_services/recipe-data.service';
import { Data, Recipe, User } from '../../_interfaces/interface';
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

  public favourite = false;
  public sendingDate: any;
  public rateaverage = 0;
  public ratecount = 0;
  public rateUser = 0;

  public comment: string;
  public comments: Data['comments'];

  private user: firebase.User;
  public loggedInUserId: string;
  public loggedInUserData: User;
  public selectedRecipeId: any;

  public recipe: Recipe;
  public recipedata: Data;

  public labelPosition = 'before';

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private recipeService: RecipeService,
    private recipeDataService: RecipeDataService,
    private route: ActivatedRoute,
    public afAuth: AngularFireAuth,
    private ngZone: NgZone
  ) { }

  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  triggerResize() {
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    this.selectedRecipeId = this.route.snapshot.paramMap.get('id');
    this.recipeService.getRecipe(this.selectedRecipeId).subscribe(recipe => {
      this.recipe = recipe;
      if (!this.recipe) { return; }
      this.sendingDate = recipe.sendingDate.seconds * 1000;
    });
    this.loginService.getLoggedInUser().subscribe(user => {
      this.user = user;
      if (!this.user) { return; }
      this.loggedInUserId = user.uid;
      this.writeOpened();
      this.userService.getUser(this.loggedInUserId).subscribe(userdata => {
        this.loggedInUserData = userdata;
        if (!this.loggedInUserData) { return; }
        const favouriteUser = this.loggedInUserData.favourites.filter(rr => rr.recipeid === this.selectedRecipeId);
        if (favouriteUser.length !== 0) {
          this.favourite = true;
        }
      });
      this.recipeDataService.getRecipeData(this.selectedRecipeId).pipe(take(1)).subscribe(recipedata => {
        this.recipedata = recipedata;
        if (!this.recipedata) { return; }
        this.ratecount = recipedata.ratecount;
        this.rateaverage = recipedata.rateaverage;
        this.comments = recipedata.comments;
      });
      this.showComments();
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
          rate: [],
          comments: []
        };
        this.recipeDataService.updateRecipeData(this.selectedRecipeId, writeopened);
      }
    });
  }

  toggleFavourites() {
    this.favourite = !this.favourite;
    this.userService.getUser(this.loggedInUserId).pipe(take(1)).subscribe(userdata => {
      this.loggedInUserData = userdata;
      if (!this.loggedInUserData) { return; }
      const favouritesOther = this.loggedInUserData.favourites.filter(rr => rr.recipeid !== this.selectedRecipeId);
      const favouriteUser = this.loggedInUserData.favourites.filter(rr => rr.recipeid === this.selectedRecipeId);
      if (favouriteUser.length === 0) {
        const writefavourite: any = {
          favourites: [{ recipeid: this.selectedRecipeId }, ...favouritesOther]
        };
        this.userService.updateUser(this.loggedInUserId, writefavourite);
      } else {
        const writefavourite: any = {
          favourites: [...favouritesOther]
        };
        this.userService.updateUser(this.loggedInUserId, writefavourite);
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
  showComments() {
    this.recipeDataService.getRecipeData(this.selectedRecipeId).subscribe(recipedata => {
      if (!recipedata) { return; }
      this.recipedata = recipedata;
      this.comments = this.recipedata.comments;
    });
  }
  addComment() {
    const writerecipecomment: any = {
      comments: [{
        uid: this.loggedInUserId,
        name: this.loggedInUserData.name,
        photoURL: this.loggedInUserData.photoURL,
        commentdate: new Date(),
        comment: this.comment,
      }, ...this.comments]
    };
    this.recipeDataService.updateRecipeData(this.selectedRecipeId, writerecipecomment);
    this.comment = null;
  }
}
