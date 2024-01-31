import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvesmentorComponent } from './add-invesmentor.component';

describe('AddInvesmentorComponent', () => {
  let component: AddInvesmentorComponent;
  let fixture: ComponentFixture<AddInvesmentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInvesmentorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInvesmentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
