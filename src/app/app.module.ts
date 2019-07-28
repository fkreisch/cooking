// CORE
import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgxHmCarouselModule } from 'ngx-hm-carousel';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StarRatingModule } from 'angular-star-rating';
// FIRESTORE
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
// MATERIAL
import {
  MatSelectModule,
  MatChipsModule,
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatIconModule,
  MatMenuModule,
  MatExpansionModule,
  MatListModule,
  MatInputModule,
  MatPaginatorModule,
  MatToolbarModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatTabsModule,
  MatStepperModule,
  MatSnackBarModule,
  MatBottomSheetModule,
} from '@angular/material';
// SERVICE
import { environment } from '../environments/environment';
import { RecipeService } from './_services/recipe.service';
import { RecipeDataService } from './_services/recipe-data.service';
import { LoginService } from './_services/login.service';
import { UserService } from './_services/user.service';

// COMPONENT
import { HomeComponent } from './base/home/home.component';
import { MenuComponent } from './base/menu/menu.component';
import { RecipesAdminComponent } from './recipes/recipes-admin/recipes-admin.component';
import { RecipesAddComponent } from './recipes/recipes-add/recipes-add.component';
import { RecipesModifyComponent } from './recipes/recipes-modify/recipes-modify.component';
import { RecipeFilterPipe } from './recipes/recipe-filter.pipe';
import { RecipesAllComponent } from './recipes/recipes-all/recipes-all.component';
import { RecipeComponent } from './recipes/recipe/recipe.component';
import { RecipeCommentsComponent } from './recipes/recipe-comments/recipe-comments.component';
import { RecipeSendComponent } from './recipes/recipe-send/recipe-send.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { SnackComponent } from './base/snack/snack.component';
import { UserComponent } from './base/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RecipesAdminComponent,
    RecipesAddComponent,
    RecipesModifyComponent,
    HomeComponent,
    RecipeFilterPipe,
    RecipesAllComponent,
    RecipeComponent,
    RecipeCommentsComponent,
    RecipeSendComponent,
    RecipeEditComponent,
    SnackComponent,
    UserComponent,

  ],
  entryComponents: [
    SnackComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    FlexLayoutModule,
    StarRatingModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatDividerModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatStepperModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    NgxHmCarouselModule,
  ],
  providers: [
    RecipeService,
    RecipeDataService,
    LoginService,
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
