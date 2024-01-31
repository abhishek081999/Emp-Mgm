import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalForPostponeComponent } from './modal-for-postpone.component';

describe('ModalForPostponeComponent', () => {
  let component: ModalForPostponeComponent;
  let fixture: ComponentFixture<ModalForPostponeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalForPostponeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalForPostponeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
