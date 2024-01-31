import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorshipDetailsComponent } from './mentorship-details.component';

describe('MentorshipDetailsComponent', () => {
  let component: MentorshipDetailsComponent;
  let fixture: ComponentFixture<MentorshipDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorshipDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorshipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
