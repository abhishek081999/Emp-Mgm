import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardingTasklistComponent } from './offboarding-tasklist.component';

describe('OffboardingTasklistComponent', () => {
  let component: OffboardingTasklistComponent;
  let fixture: ComponentFixture<OffboardingTasklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffboardingTasklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffboardingTasklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
