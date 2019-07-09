import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rate, RateId, Id } from './recipe-interface';

@Injectable({
  providedIn: 'root'
})
export class RecipeRateService {

  private recipeRateCollection: AngularFirestoreCollection<Rate>;
  private recipeRateDoc: AngularFirestoreDocument<Rate>;
  private recipesrates: Observable<RateId[]>;

  constructor(public afs: AngularFirestore) {
    this.recipeRateCollection = afs.collection<Rate>('recipe-rate');
  }

  getRecipesRates() {
    this.recipesrates = this.recipeRateCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Rate;
        const id = a.payload.doc.id;
        // console.log('(recipe-rate.service) FIREBASE GET:', id, data);
        return { id, ...data };
      }))
    );
    return this.recipesrates;
  }

  addRecipeRate(doc: Rate) {
    console.log('(recipe-rate.service) FIREBASE ADD --', doc);
    this.recipeRateCollection.add(doc);
  }

  deleteRecipeRate(id: Id) {
    console.log('(recipe-rate.service) FIREBASE DELETE --', id);
    this.recipeRateDoc = this.afs.doc(`recipe-rate/${id}`);
    this.recipeRateDoc.delete();
  }

  updateRecipeRate(id: Id, doc: Rate) {
    console.log('(recipe-rate.service) FIREBASE UPDATE --', doc);
    this.recipeRateDoc = this.afs.doc(`recipe-rate/${id}`);
    this.recipeRateDoc.set(doc, {merge: true});
  }
}
