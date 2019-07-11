import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Observable } from 'rxjs';
import { User, UserId } from './user-interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private userDoc: AngularFirestoreDocument<any>;
  private user: Observable<User>;

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

  getUser(id: string) {
    this.userDoc = this.afs.doc<User>(`user/${id}`);
    this.user = this.userDoc.valueChanges();
    return this.user;
  }

  updateUser(id: any, doc: any) {
    console.log('(login.service) FIREBASE USER UPDATE --', id, doc);
    this.userDoc = this.afs.doc(`user/${id}`);
    this.userDoc.set(doc, { merge: true });
  }
}
