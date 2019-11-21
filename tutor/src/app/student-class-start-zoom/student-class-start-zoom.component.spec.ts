import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentClassStartZoomComponent } from './student-class-start-zoom.component';

describe('StudentClassStartZoomComponent', () => {
  let component: StudentClassStartZoomComponent;
  let fixture: ComponentFixture<StudentClassStartZoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentClassStartZoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentClassStartZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
