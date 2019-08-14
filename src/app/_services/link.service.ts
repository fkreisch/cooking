import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Link } from '../_interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  linkCollection: AngularFirestoreCollection<Link>;

  constructor(public afs: AngularFirestore) {}

   getLinks() {
    this.linkCollection = this.afs.collection<Link>('links');
    const links = [];
    this.linkCollection.ref.get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          links.push(doc.data() as Link);
        });
      });
    console.log('(link.service) FIREBASE GET:', links);
    return links;
  }
}
