/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PptComponent } from './ppt.component';

describe('PptComponent', () => {
  let component: PptComponent;
  let fixture: ComponentFixture<PptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
