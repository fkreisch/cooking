import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksAllComponent } from './links-all.component';

describe('LinksAllComponent', () => {
  let component: LinksAllComponent;
  let fixture: ComponentFixture<LinksAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinksAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinksAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
