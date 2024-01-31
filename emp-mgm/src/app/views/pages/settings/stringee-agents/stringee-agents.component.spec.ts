import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringeeAgentsComponent } from './stringee-agents.component';

describe('StringeeAgentsComponent', () => {
  let component: StringeeAgentsComponent;
  let fixture: ComponentFixture<StringeeAgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StringeeAgentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StringeeAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
