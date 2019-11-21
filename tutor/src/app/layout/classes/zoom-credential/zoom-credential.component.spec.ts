import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomCredentialComponent } from './zoom-credential.component';

describe('ZoomCredentialComponent', () => {
  let component: ZoomCredentialComponent;
  let fixture: ComponentFixture<ZoomCredentialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoomCredentialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
