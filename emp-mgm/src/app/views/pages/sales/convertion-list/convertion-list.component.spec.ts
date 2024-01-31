import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertionListComponent } from './convertion-list.component';

describe('ConvertionListComponent', () => {
  let component: ConvertionListComponent;
  let fixture: ComponentFixture<ConvertionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvertionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
