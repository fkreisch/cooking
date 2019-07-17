import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

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
}
