import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingKitComponent } from './training-kit.component';

describe('TrainingKitComponent', () => {
  let component: TrainingKitComponent;
  let fixture: ComponentFixture<TrainingKitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingKitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
