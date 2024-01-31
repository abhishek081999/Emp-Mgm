import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportSettingsComponent } from './support-settings.component';

describe('SupportSettingsComponent', () => {
  let component: SupportSettingsComponent;
  let fixture: ComponentFixture<SupportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
