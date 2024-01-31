import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvesletterComponent } from './invesletter.component';

describe('InvesletterComponent', () => {
  let component: InvesletterComponent;
  let fixture: ComponentFixture<InvesletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvesletterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvesletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
