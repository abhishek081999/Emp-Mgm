import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsigniaRegistrationComponent } from './insignia-registration.component';

describe('InsigniaRegistrationComponent', () => {
  let component: InsigniaRegistrationComponent;
  let fixture: ComponentFixture<InsigniaRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsigniaRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsigniaRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
