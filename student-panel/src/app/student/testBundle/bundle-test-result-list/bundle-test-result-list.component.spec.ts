import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleTestResultListComponent } from './bundle-test-result-list.component';

describe('BundleTestResultListComponent', () => {
  let component: BundleTestResultListComponent;
  let fixture: ComponentFixture<BundleTestResultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundleTestResultListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleTestResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
