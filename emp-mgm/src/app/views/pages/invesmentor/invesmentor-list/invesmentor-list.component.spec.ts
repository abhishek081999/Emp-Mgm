import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvesmentorListComponent } from './invesmentor-list.component';

describe('InvesmentorListComponent', () => {
  let component: InvesmentorListComponent;
  let fixture: ComponentFixture<InvesmentorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvesmentorListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvesmentorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
