import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorshipListComponent } from './mentorship-list.component';

describe('MentorshipListComponent', () => {
  let component: MentorshipListComponent;
  let fixture: ComponentFixture<MentorshipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorshipListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorshipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
