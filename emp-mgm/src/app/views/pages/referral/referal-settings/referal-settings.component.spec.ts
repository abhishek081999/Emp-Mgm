import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferalSettingsComponent } from './referal-settings.component';

describe('ReferalSettingsComponent', () => {
  let component: ReferalSettingsComponent;
  let fixture: ComponentFixture<ReferalSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferalSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
