import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestListAllComponent } from './test-list-all.component';

describe('TestListAllComponent', () => {
  let component: TestListAllComponent;
  let fixture: ComponentFixture<TestListAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestListAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestListAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
