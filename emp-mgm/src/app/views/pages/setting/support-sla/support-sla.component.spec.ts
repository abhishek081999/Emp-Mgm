import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportSlaComponent } from './support-sla.component';

describe('SupportSlaComponent', () => {
  let component: SupportSlaComponent;
  let fixture: ComponentFixture<SupportSlaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportSlaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportSlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
