import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { LoginService } from './login.service';
import { SuperuserService } from './superuser.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
  public user: firebase.User;
  public superuser: any;
  public isSuperUser: string;

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
    this.loginService.getLoggedInUser()
      .subscribe(user => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      });
    this.superuserService.getSuperuser()
      .subscribe(superuser => {
        this.superuser = superuser;
        if (this.superuser[0].superuser_id === this.user.uid) {
          this.isSuperUser = 'true';
        } else {
          this.isSuperUser = 'false';
        }
        console.log('SUPERUSER:', this.superuser[0].superuser_id, this.user.uid, this.isSuperUser);
        localStorage.setItem('isSuperUser', this.isSuperUser);
      });
  }

  loginGoogle() {
    this.loginService.login();
  }

  logout() {
    this.loginService.logout();
    localStorage.removeItem('isSuperUser');
    localStorage.removeItem('user');
    this.isSuperUser = 'false';
  }
}
