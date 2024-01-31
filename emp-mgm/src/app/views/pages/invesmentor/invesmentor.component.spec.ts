import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvesmentorComponent } from './invesmentor.component';

describe('InvesmentorComponent', () => {
  let component: InvesmentorComponent;
  let fixture: ComponentFixture<InvesmentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvesmentorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvesmentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
