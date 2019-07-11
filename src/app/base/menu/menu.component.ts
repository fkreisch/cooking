import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  isHandset: boolean;
  public user: firebase.User;
  public loggedInSupervisor = false;

  constructor(private breakpointObserver: BreakpointObserver, private loginService: LoginService) { }

  ngOnInit() {
    // mobile view check: BreakpointObserver
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
    this.loginService.getUser(id).subscribe(getuser => {
      if (getuser) {
        this.loggedInSupervisor = getuser.supervisor;
      } else {
        const writeuser: any = {
          supervisor: false,
          favourites: []
        };
        this.loginService.updateUser(id, writeuser);
      }
    });
  }

  loginGoogle() {
    this.loginService.login();
  }

  logout() {
    this.loggedInSupervisor = null;
    this.loginService.logout();
  }
}
