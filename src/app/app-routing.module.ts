import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesAllComponent } from './recipes/recipes-all/recipes-all.component';
import { HomeComponent } from './base/home/home.component';
import { UserComponent } from './base/user/user.component';
import { RecipeComponent } from './recipes/recipe/recipe.component';
import { RecipeSendComponent } from './recipes/recipe-send/recipe-send.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'recipes/:pagefilter',
    component: RecipesAllComponent,
    data: { shouldReuse: true }
  },
  {
    path: 'recipe-send',
    component: RecipeSendComponent
  },
  {
    path: 'recipe/:id',
    component: RecipeComponent
  },
  {
    path: 'recipe-edit/:id',
    component: RecipeEditComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  static routableComponents = [
    HomeComponent,
    RecipesAllComponent,
  ];

}
