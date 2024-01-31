import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronjobRunnerComponent } from './cronjob-runner.component';

describe('CronjobRunnerComponent', () => {
  let component: CronjobRunnerComponent;
  let fixture: ComponentFixture<CronjobRunnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CronjobRunnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CronjobRunnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
