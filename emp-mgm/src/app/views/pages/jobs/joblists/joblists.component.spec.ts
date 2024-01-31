import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoblistsComponent } from './joblists.component';

describe('JoblistsComponent', () => {
  let component: JoblistsComponent;
  let fixture: ComponentFixture<JoblistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoblistsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoblistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
