import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserId } from '../_interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<User>;
  private userDoc: AngularFirestoreDocument<User>;
  private user: Observable<User>;
  private users: Observable<UserId[]>;

  constructor(private afs: AngularFirestore) { }

  getUsers() {
    this.userCollection = this.afs.collection<User>('user');
    this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;
        // console.log('(user.service) FIREBASE GET:', id, data);
        return { id, ...data };
      }))
    );
    return this.users;
  }

  getUser(id: string) {
    this.userDoc = this.afs.doc<User>(`user/${id}`);
    this.user = this.userDoc.valueChanges();
    return this.user;
  }

  updateUser(id: any, doc: any) {
    console.log('(user.service) FIREBASE USER UPDATE --', id, doc);
    this.userDoc = this.afs.doc(`user/${id}`);
    this.userDoc.set(doc, { merge: true });
  }
}
