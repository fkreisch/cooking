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
  private recipeRatesDoc: AngularFirestoreDocument<Rate>;
  private recipeRates: Observable<Rate>;

  constructor(public afs: AngularFirestore) {}

  getRecipeRates(id: Id) {
    this.recipeRatesDoc = this.afs.doc<Rate>(`recipe-rate/${id}`);
    this.recipeRates = this.recipeRatesDoc.valueChanges();
    // console.log('(recipe-rate.service) FIREBASE GET:', id);
    return this.recipeRates;
    }

  addRecipeRate(doc: Rate) {
    console.log('(recipe-rate.service) FIREBASE ADD --', doc);
    this.recipeRateCollection.add(doc);
  }

  deleteRecipeRate(id: Id) {
    console.log('(recipe-rate.service) FIREBASE DELETE --', id);
    this.recipeRatesDoc = this.afs.doc(`recipe-rate/${id}`);
    this.recipeRatesDoc.delete();
  }

  updateRecipeRate(id: Id, doc: Rate) {
    console.log('(recipe-rate.service) FIREBASE UPDATE --', doc);
    this.recipeRatesDoc = this.afs.doc(`recipe-rate/${id}`);
    this.recipeRatesDoc.set(doc, {merge: true});
  }
}
