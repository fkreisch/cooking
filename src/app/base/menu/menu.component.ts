import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { LoginService } from '../../_services/login.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})

export class MenuComponent implements OnInit, AfterViewInit {

  isHandset: boolean;
  public user: firebase.User;
  public hide = true;
  public isHome = false;

  @ViewChild('stickyMenu', null) menuElement: ElementRef;

  sticky = false;
  elementPosition: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private loginService: LoginService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((state: BreakpointState) => {
        this.isHandset = state.matches ? true : false;
      });

    const pageFilter = this.route.snapshot.paramMap.get('pagefilter');
    if (pageFilter === '' || pageFilter === 'home') {
      this.isHome = true;
    }
    this.loginService.getLoggedInUser().subscribe(user => {
      if (!user) {
        this.user = null;
        return;
      }
      this.user = user;
    });
  }

  ngAfterViewInit() {
    this.elementPosition = this.menuElement.nativeElement.offsetTop;
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= this.elementPosition) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }
}
