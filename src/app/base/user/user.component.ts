import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../_services/login.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackComponent } from '../../base/snack/snack.component';
import { finalize, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  public user: firebase.User;
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public hide = true;

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private location: Location,
    private storage: AngularFireStorage,
    private snackBar: MatSnackBar) {

    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
    this.registerForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit() {
    this.getUser();
  }

  openSnackBar(message: string) {
    this.snackBar.openFromComponent(SnackComponent, {
      duration: 3000,
      data: message
    });
  }

  close() {
    this.location.back();
  }

  getUser() {
    this.loginService.getLoggedInUser().subscribe(user => {
      if (!user) { return; }
      this.user = user;
      console.log(this.user);
    });
  }

  registerEmail(value) {
    this.close();
    this.loginService.registerEmail(value)
      .then(res => {
      }, err => {
        console.log(err);
      });
  }

  loginEmail(value) {
    this.close();
    this.loginService.loginEmail(value)
      .then(res => {
      }, err => {
        console.log(err);
      });
  }

  loginGoogle() {
    this.close();
    this.loginService.loginGoogle()
      .then(res => {
      }, err => {
        console.log(err);
      });
  }

  logout() {
    this.loginService.logout();
    this.close();
  }

  uploadFile(event, action) {
    const file = event.target.files[0];
    const filePath = 'avatars/' + Math.random().toString(36).substring(7) + '-' + event.target.files[0].name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          if (!url) { return; }
          this.downloadURL = url;
          this.loginService.updateUser(this.downloadURL);
          this.uploadPercent = null;
          this.openSnackBar('A kiválasztott fájlt feltöltöttük és beállítottuk.');
        });
      })
    )
      .subscribe();
  }
}
