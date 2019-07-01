import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe, RecipeId } from './recipe-interface';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private recipeCollection: AngularFirestoreCollection<Recipe>;
  private recipeDoc: AngularFirestoreDocument<Recipe>;
  private recipe: Observable<RecipeId[]>;

  constructor(public afs: AngularFirestore) {
    this.recipeCollection = afs.collection<Recipe>('recipe', ref => ref.orderBy('name'));
  }

  getRecipe() {
    this.recipe = this.recipeCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Recipe;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.recipe;
  }

  addRecipe(doc: Recipe) {
    this.recipeCollection.add(doc);
  }

  deleteRecipe(doc: RecipeId) {
    this.recipeDoc = this.afs.doc(`recipe/${doc.id}`);
    this.recipeDoc.delete();
  }

  updateRecipe(docId: RecipeId, doc: Recipe) {
    this.recipeDoc = this.afs.doc(`recipe/${docId.id}`);
    this.recipeDoc.set(doc, {merge: true});
  }
}
