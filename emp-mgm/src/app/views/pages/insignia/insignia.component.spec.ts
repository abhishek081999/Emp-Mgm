import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsigniaComponent } from './insignia.component';

describe('InsigniaComponent', () => {
  let component: InsigniaComponent;
  let fixture: ComponentFixture<InsigniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsigniaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsigniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
