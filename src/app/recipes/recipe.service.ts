import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe, RecipeId, Id } from './recipe-interface';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private recipeCollection: AngularFirestoreCollection<Recipe>;
  private recipeDoc: AngularFirestoreDocument<Recipe>;
  private recipes: Observable<RecipeId[]>;

  constructor(public afs: AngularFirestore) {
    this.recipeCollection = afs.collection<Recipe>('recipe', ref => ref.orderBy('name'));
  }

  getRecipes() {
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

  addRecipe(doc: Recipe) {
    console.log('(recipe.service) FIREBASE ADD --', doc);
    this.recipeCollection.add(doc);
  }

  deleteRecipe(id: Id) {
    console.log('(recipe.service) FIREBASE DELETE --', id);
    this.recipeDoc = this.afs.doc(`recipe/${id}`);
    this.recipeDoc.delete();
  }

  updateRecipe(id: Id, doc: Recipe) {
    console.log('(recipe.service) FIREBASE UPDATE --', doc);
    this.recipeDoc = this.afs.doc(`recipe/${id}`);
    this.recipeDoc.set(doc, {merge: true});
  }
}
