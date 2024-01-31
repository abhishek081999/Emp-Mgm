import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOnboardingsettingComponent } from './create-onboardingsetting.component';

describe('CreateOnboardingsettingComponent', () => {
  let component: CreateOnboardingsettingComponent;
  let fixture: ComponentFixture<CreateOnboardingsettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOnboardingsettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOnboardingsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
