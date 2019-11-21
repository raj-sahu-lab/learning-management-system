import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalChatComponent } from './normal-chat.component';

describe('NormalChatComponent', () => {
  let component: NormalChatComponent;
  let fixture: ComponentFixture<NormalChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NormalChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NormalChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
