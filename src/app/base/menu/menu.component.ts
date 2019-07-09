import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { LoginService } from '../login.service';
import { SuperuserService } from '../superuser.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  isHandset: boolean;
  public user: firebase.User;
  public isSuperUser: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private loginService: LoginService,
    private superuserService: SuperuserService,
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

    this.loginService.getLoggedInUser()
      .subscribe(user => {
        this.user = user;
        // console.log('(menu.component) User logged in: ', JSON.stringify(this.user));
        localStorage.setItem('loggedInUser', JSON.stringify(this.user));
      });

    this.superuserService.getSuperuser()
      .subscribe(superuser => {
        this.isSuperUser = superuser[0].superuser_id === this.user.uid ? true : false;
      });
  }

  loginGoogle() {
    this.loginService.login();
  }

  logout() {
    this.loginService.logout();
  }
}
