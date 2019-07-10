import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { LoginService } from '../login.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  isHandset: boolean;
  public user: firebase.User;
  public isSuperUser: boolean;
  private users: any[];
  private loggedInUserData: any;
  public loggedInUserId: string;
  public loggedInSupervisor = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private loginService: LoginService,
    private router: Router,
  ) { }

  // store like this:
  // localStorage.setItem('my_item', JSON.stringify(my_object));
  // and use like this:
  // var my_object = JSON.parse(localStorage.getItem('my_item'));

  ngOnInit() {
    // mobile view check: BreakpointObserver
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((state: BreakpointState) => {
        this.isHandset = state.matches ? true : false;
      });

    this.loginService.getLoggedInUser().pipe(take(1))
      .subscribe(user => {
        this.user = user;
        if (this.user !== null) {

          this.readUser(this.user.uid);
          // this.loginService.updateUser(this.user.uid, userdata);
        }
      });
  }

  readUser(id: string) {
    this.loginService.getUser(id).pipe(take(1)).subscribe(user => {
      this.loggedInUserData = user;
      this.loggedInUserId = this.loggedInUserData[0].id;
      this.loggedInSupervisor = this.loggedInUserData[0].supervisor;
    });
  }

  writeUser() {
    if (this.user !== null) {
      const userdata = {
        uid: this.user.uid,
        displayName: this.user.displayName,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber,
        photoURL: this.user.photoURL,
        emailVerified: this.user.emailVerified,
        lastLogin: new Date(),
        supervisor: true
      };
    }
  }

  loginGoogle() {
    this.loginService.login();
  }

  logout() {
    this.loggedInSupervisor = false;
    this.loggedInUserId = 'Undefinied';
    this.loggedInUserData = null;
    this.loginService.logout();
  }
}
