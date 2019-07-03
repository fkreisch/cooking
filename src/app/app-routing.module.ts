import { Recipe } from './recipes/recipe-interface';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesAdminComponent } from './recipes/recipes-admin/recipes-admin.component';
import { RecipesAllComponent } from './recipes/recipes-all/recipes-all.component';
import { HomeComponent } from './home/home.component';
import { LinksAllComponent } from './links/links-all/links-all.component';
import { RecipeComponent } from './recipes/recipe/recipe.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'recipes',
    component: RecipesAllComponent
  },
  {
    path: 'links',
    component: LinksAllComponent
  },
  {
    path: 'recipe-admin',
    component: RecipesAdminComponent
  },
  {
    path: 'recipe/:id',
    component: RecipeComponent, pathMatch: 'full'
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
    RecipesAdminComponent,
    LinksAllComponent,
  ];

}
