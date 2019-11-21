/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PollsComponent } from './polls.component';

describe('PollsComponent', () => {
  let component: PollsComponent;
  let fixture: ComponentFixture<PollsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
