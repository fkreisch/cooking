import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe, RecipeId, Id } from '../_interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipeCollection: AngularFirestoreCollection<Recipe>;
  recipeDoc: AngularFirestoreDocument<Recipe>;
  recipes: Observable<RecipeId[]>;
  recipe: Observable<Recipe>;

  constructor(public afs: AngularFirestore) { }

  getRecipes() {
    this.recipeCollection = this.afs.collection<Recipe>('recipe', ref => ref.orderBy('name'));
    this.recipes = this.recipeCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Recipe;
        const id = a.payload.doc.id;
        // console.log('(recipe.service) FIREBASE GET:', id, data);
        return { id, ...data };
      }))
    );
    return this.recipes;
  }

  getSharedRecipes() {
    this.recipeCollection = this.afs.collection<Recipe>('recipe', ref => ref.where('share', '==', true).orderBy('name'));
    this.recipes = this.recipeCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Recipe;
        const id = a.payload.doc.id;
        // console.log('(recipe.service) FIREBASE GET (only shared recipes):', id, data);
        return { id, ...data };
      }))
    );
    return this.recipes;
  }

  getRecipe(id: Id) {
    this.recipeDoc = this.afs.doc<Recipe>(`recipe/${id}`);
    this.recipe = this.recipeDoc.valueChanges();
    // console.log('(recipe.service) FIREBASE GET:', id, this.recipe);
    return this.recipe;
  }

  addRecipe(doc: Recipe) {
    this.recipeCollection = this.afs.collection<Recipe>('recipe');
    console.log('(recipe.service) FIREBASE ADD --', doc);
    this.recipeCollection.add(doc);
  }

  deleteRecipe(id: Id) {
    console.log('(recipe.service) FIREBASE DELETE --', id);
    this.recipeDoc = this.afs.doc<Recipe>(`recipe/${id}`);
    this.recipeDoc.delete();
  }

  updateRecipe(id: Id, doc: Recipe) {
    console.log('(recipe.service) FIREBASE UPDATE --', doc);
    this.recipeDoc = this.afs.doc<Recipe>(`recipe/${id}`);
    this.recipeDoc.set(doc, { merge: true });
  }
}
