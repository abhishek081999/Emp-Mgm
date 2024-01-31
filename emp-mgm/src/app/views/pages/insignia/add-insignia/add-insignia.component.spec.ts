import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInsigniaComponent } from './add-insignia.component';

describe('AddInsigniaComponent', () => {
  let component: AddInsigniaComponent;
  let fixture: ComponentFixture<AddInsigniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInsigniaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInsigniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
