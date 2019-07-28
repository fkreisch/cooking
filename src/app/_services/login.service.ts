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
        .then(() => {
          this.afAuth.auth.currentUser.updateProfile({
            displayName: value.name,
            // tslint:disable-next-line: max-line-length
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/rmcook-b0a1e.appspot.com/o/system%2Fdefault-avatar.png?alt=media&token=28ce7783-aee3-46a4-be35-19dd9f85fefc'
          }).then(res => {
            resolve(res);
          }).catch(err => console.log(err));
        }, err => reject(err));
    });
  }

  loginEmail(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err));
    });
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

  updateUser(photo: any) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.currentUser.updateProfile({
        photoURL: photo,
      }).then(res => {
        resolve(res);
      }).catch(err => reject(err));
    });
  }
}
