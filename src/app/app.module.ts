import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
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
  MatInputModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';

import { environment } from '../environments/environment';
import { RecipeService } from './recipes/recipe.service';
import { LoginService } from './base/menu/login.service';
import { SuperuserService } from './base/menu/superuser.service';

import { MenuComponent } from './base/menu/menu.component';
import { RecipesAdminComponent } from './recipes/recipes-admin/recipes-admin.component';
import { RecipesAddComponent } from './recipes/recipes-add/recipes-add.component';
import { RecipesModifyComponent } from './recipes/recipes-modify/recipes-modify.component';
import { RecipesAllComponent } from './recipes/recipes-all/recipes-all.component';
import { HomeComponent } from './home/home.component';
import { LinksAdminComponent } from './links/links-admin/links-admin.component';
import { LinksAllComponent } from './links/links-all/links-all.component';



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RecipesAdminComponent,
    RecipesAddComponent,
    RecipesModifyComponent,
    RecipesAllComponent,
    HomeComponent,
    LinksAdminComponent,
    LinksAllComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
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
    FlexLayoutModule,
    MatDividerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFontAwesomeModule,
  ],
  providers: [
    RecipeService,
    LoginService,
    SuperuserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
