import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumDiscussionComponent } from './forum-discussion.component';

describe('ForumDiscussionComponent', () => {
  let component: ForumDiscussionComponent;
  let fixture: ComponentFixture<ForumDiscussionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumDiscussionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
