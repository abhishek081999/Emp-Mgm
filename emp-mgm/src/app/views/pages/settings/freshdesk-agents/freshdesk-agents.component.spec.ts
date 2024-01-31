import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshdeskAgentsComponent } from './freshdesk-agents.component';

describe('FreshdeskAgentsComponent', () => {
  let component: FreshdeskAgentsComponent;
  let fixture: ComponentFixture<FreshdeskAgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreshdeskAgentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshdeskAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
