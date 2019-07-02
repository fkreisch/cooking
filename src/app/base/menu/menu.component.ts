import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  user: firebase.User;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.getLoggedInUser()
      .subscribe(user => {
        this.user = user;
      });

  }

  loginGoogle() {
    this.loginService.login();
  }

  logout() {
    this.loginService.logout();
  }
}
