import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollslistComponent } from './pollslist.component';

describe('PollslistComponent', () => {
  let component: PollslistComponent;
  let fixture: ComponentFixture<PollslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
