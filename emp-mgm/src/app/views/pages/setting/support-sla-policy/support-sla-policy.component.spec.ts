import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportSlaPolicyComponent } from './support-sla-policy.component';

describe('SupportSlaPolicyComponent', () => {
  let component: SupportSlaPolicyComponent;
  let fixture: ComponentFixture<SupportSlaPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportSlaPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportSlaPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
