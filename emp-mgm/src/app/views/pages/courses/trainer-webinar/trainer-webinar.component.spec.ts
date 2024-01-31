import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerWebinarComponent } from './trainer-webinar.component';

describe('TrainerWebinarComponent', () => {
  let component: TrainerWebinarComponent;
  let fixture: ComponentFixture<TrainerWebinarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainerWebinarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerWebinarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
