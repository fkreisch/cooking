import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { SuperuserService } from '../superuser.service';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss']
})
export class MenuItemsComponent implements OnInit {

  public user: firebase.User;
  public isSuperUser: boolean;

  constructor(
    private loginService: LoginService,
    private superuserService: SuperuserService,
  ) { }

  ngOnInit() {
    this.loginService.getLoggedInUser()
      .subscribe(user => {
        this.user = user;
      });

    this.superuserService.getSuperuser()
      .subscribe(superuser => {
        this.isSuperUser = superuser[0].superuser_id === this.user.uid ? true : false;
      });
  }

}
