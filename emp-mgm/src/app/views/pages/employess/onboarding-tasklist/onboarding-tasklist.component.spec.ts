import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingTasklistComponent } from './onboarding-tasklist.component';

describe('OnboardingTasklistComponent', () => {
  let component: OnboardingTasklistComponent;
  let fixture: ComponentFixture<OnboardingTasklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingTasklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingTasklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
