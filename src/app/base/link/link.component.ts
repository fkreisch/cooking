import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../_services/link.service';
import { Link } from '../../_interfaces/interface';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit {

  public avatars: Link[];

  constructor(private linkService: LinkService) { }

  ngOnInit() {
    this.avatars = this.linkService.getLinks();
  }

  click(url) {
    window.open(url, '_blank');
  }
}
