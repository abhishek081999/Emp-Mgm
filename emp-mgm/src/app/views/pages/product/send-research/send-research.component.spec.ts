import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendResearchComponent } from './send-research.component';

describe('SendResearchComponent', () => {
  let component: SendResearchComponent;
  let fixture: ComponentFixture<SendResearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendResearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
