import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveclasssinglepageComponent } from './liveclasssinglepage.component';

describe('LiveclasssinglepageComponent', () => {
  let component: LiveclasssinglepageComponent;
  let fixture: ComponentFixture<LiveclasssinglepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveclasssinglepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveclasssinglepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
