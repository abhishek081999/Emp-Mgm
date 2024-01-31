import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvesmentorRegistrationComponent } from './invesmentor-registration.component';

describe('InvesmentorRegistrationComponent', () => {
  let component: InvesmentorRegistrationComponent;
  let fixture: ComponentFixture<InvesmentorRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvesmentorRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvesmentorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
