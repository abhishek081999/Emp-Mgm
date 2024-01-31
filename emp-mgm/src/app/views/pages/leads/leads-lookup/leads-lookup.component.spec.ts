import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsLookupComponent } from './leads-lookup.component';

describe('LeadsLookupComponent', () => {
  let component: LeadsLookupComponent;
  let fixture: ComponentFixture<LeadsLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsLookupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
