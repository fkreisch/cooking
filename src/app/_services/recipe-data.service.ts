import { Injectable } from '@angular/core';
// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// import { Observable} from 'rxjs'
// import { Data, Id } from '../_interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class RecipeDataService {

  // private recipeDataCollection: AngularFirestoreCollection<Data>;
  // private recipeDatasDoc: AngularFirestoreDocument<Data>;
  // private recipeData: Observable<Data>;

  // private joined: Observable<any>;

  // constructor(public afs: AngularFirestore) { }

  // getRecipeData(id: Id) {
  //   this.recipeDatasDoc = this.afs.doc<Data>(`recipe-data/${id}`);
  //   this.recipeData = this.recipeDatasDoc.valueChanges();
  //   // console.log('(recipe-Data.service) FIREBASE GET:', id, this.recipeData);
  //   return this.recipeData;
  // }

  // addRecipeData(doc: Data) {
  //   console.log('(recipe-data.service) FIREBASE ADD --', doc);
  //   this.recipeDataCollection.add(doc);
  // }

  // deleteRecipeData(id: Id) {
  //   console.log('(recipe-data.service) FIREBASE DELETE --', id);
  //   this.recipeDatasDoc = this.afs.doc(`recipe-data/${id}`);
  //   this.recipeDatasDoc.delete();
  // }

  // updateRecipeData(id: Id, doc: Data) {
  //   console.log('(recipe-data.service) FIREBASE UPDATE --', doc);
  //   this.recipeDatasDoc = this.afs.doc(`recipe-data/${id}`);
  //   this.recipeDatasDoc.set(doc, { merge: true });
  // }
}
