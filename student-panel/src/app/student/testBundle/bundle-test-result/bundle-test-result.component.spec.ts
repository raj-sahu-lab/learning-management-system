import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleTestResultComponent } from './bundle-test-result.component';

describe('BundleTestResultComponent', () => {
  let component: BundleTestResultComponent;
  let fixture: ComponentFixture<BundleTestResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundleTestResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleTestResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
