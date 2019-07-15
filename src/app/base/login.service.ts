import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Observable } from 'rxjs';
import { User } from './user-interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private userDoc: AngularFirestoreDocument<any>;
  private user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth, private afs: AngularFirestore) {

  }

  registerEmail(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err));
    });
  }

  loginEmail(value) {
    this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password);
  }

  loginGoogle() {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider())
        .then(res => {
          resolve(res);
        }, err => reject(err));
    });
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
