import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleTestListComponent } from './bundle-test-list.component';

describe('BundleTestListComponent', () => {
  let component: BundleTestListComponent;
  let fixture: ComponentFixture<BundleTestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundleTestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
