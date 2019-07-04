import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SuperuserService {

  private superuserService: AngularFirestoreCollection<any>;
  private superuser: Observable<any[]>;

  constructor(public afs: AngularFirestore) {
    this.superuserService = afs.collection<any>('service');
  }

  getSuperuser() {
    this.superuser = this.superuserService.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        return data;
      }))
    );
    return this.superuser;
  }
}
