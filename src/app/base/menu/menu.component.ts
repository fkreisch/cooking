import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { LoginService } from '../login.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { User } from '../user-interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})

export class MenuComponent implements OnInit {

  isHandset: boolean;
  public user: firebase.User;
  public loggedInUserData: User;
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public hide = true;



  constructor(
    private breakpointObserver: BreakpointObserver,
    private loginService: LoginService,
    private fb: FormBuilder) {

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
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((state: BreakpointState) => {
        this.isHandset = state.matches ? true : false;
      });

    this.loginService.getLoggedInUser().subscribe(user => {
      this.user = user;
      if (this.user) {
        this.readUser(this.user.uid);
      }
    });
  }

  readUser(id: string) {
    this.loginService.getUser(id).pipe(take(1)).subscribe(getuser => {
      if (getuser) {
        this.loggedInUserData = getuser;
        const writeuser: any = {
          lastLogin: Date(),
        };
        this.loginService.updateUser(this.user.uid, writeuser);
      } else {
        // ez egy űtmeneti megoldás. redirect miatt nem lehet máshogy, egyenlore.
        const writeuser: any = {
          uid: this.user.uid,
          name: this.user.displayName,
          email: this.user.email,
          lastLogin: Date(),
          photoURL: this.user.photoURL,
          supervisor: false,
          favourites: []
        };
        this.loginService.updateUser(this.user.uid, writeuser);
        this.loggedInUserData = writeuser;
      }
    });
  }

  registerEmail(value, uname) {
    this.loginService.registerEmail(value)
      .then(res => {
        this.loginService.getLoggedInUser().pipe(take(1)).subscribe(user => {
          this.user = user;
          const writeuser: any = {
            uid: this.user.uid,
            name: value.name,
            email: value.email,
            lastLogin: Date(),
            // tslint:disable-next-line: max-line-length
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/rmcook-b0a1e.appspot.com/o/system%2Fdefault-avatar.png?alt=media&token=28ce7783-aee3-46a4-be35-19dd9f85fefc',
            supervisor: false,
            favourites: [],
          };
          this.loginService.updateUser(this.user.uid, writeuser);
        });
      }, err => {
        console.log(err);
      });
  }

  loginEmail(value) {
    this.loginService.loginEmail(value);
  }

  loginGoogle() {
    this.loginService.loginGoogle()
      .then(res => {
      }, err => {
        console.log(err);
      });
  }

  logout() {
    this.loggedInUserData = null;
    this.loginService.logout();
  }
}
