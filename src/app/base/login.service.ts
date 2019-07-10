import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserId } from './user-interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private usersCollection: AngularFirestoreCollection<any>;
  private usersDoc: AngularFirestoreDocument<any>;
  private users: Observable<any[]>;

  constructor(
    private afAuth: AngularFireAuth, private afs: AngularFirestore) { }

  login() {
    this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  getLoggedInUser() {
    return this.afAuth.authState;
  }

  getUser(idd: string) {
    this.usersCollection = this.afs.collection<any>('user', ref => ref.where('uid', '==', idd));
    this.users = this.usersCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;
        // console.log('(login.service) FIREBASE USER GET:', id, data);
        return { id, ...data };
      }))
    );
    return this.users;
  }

  updateUser(id: any, doc: any) {
    console.log('(login.service) FIREBASE USER UPDATE --', id, doc);
    this.usersDoc = this.afs.doc(`user/${id}`);
    this.usersDoc.set(doc, { merge: true });
  }
}
