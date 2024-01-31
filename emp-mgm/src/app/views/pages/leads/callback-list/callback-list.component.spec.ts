import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackListComponent } from './callback-list.component';

describe('CallbackListComponent', () => {
  let component: CallbackListComponent;
  let fixture: ComponentFixture<CallbackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallbackListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
