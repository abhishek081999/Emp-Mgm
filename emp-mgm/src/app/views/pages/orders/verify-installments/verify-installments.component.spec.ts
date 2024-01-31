import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyInstallmentsComponent } from './verify-installments.component';

describe('VerifyInstallmentsComponent', () => {
  let component: VerifyInstallmentsComponent;
  let fixture: ComponentFixture<VerifyInstallmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyInstallmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyInstallmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
