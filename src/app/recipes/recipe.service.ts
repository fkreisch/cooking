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
        return { id, ...data };
      }))
    );
    return this.recipes;
  }

  addRecipe(doc: Recipe) {
    this.recipeCollection.add(doc);
  }

  deleteRecipe(id: Id) {
    this.recipeDoc = this.afs.doc(`recipe/${id}`);
    this.recipeDoc.delete();
  }

  updateRecipe(id: Id, doc: Recipe) {
    this.recipeDoc = this.afs.doc(`recipe/${id}`);
    this.recipeDoc.set(doc, {merge: true});
  }
}
