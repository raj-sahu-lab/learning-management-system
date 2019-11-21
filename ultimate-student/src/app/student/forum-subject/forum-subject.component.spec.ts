import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumSubjectComponent } from './forum-subject.component';

describe('ForumSubjectComponent', () => {
  let component: ForumSubjectComponent;
  let fixture: ComponentFixture<ForumSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
