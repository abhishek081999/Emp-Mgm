import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsigniaListComponent } from './insignia-list.component';

describe('InsigniaListComponent', () => {
  let component: InsigniaListComponent;
  let fixture: ComponentFixture<InsigniaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsigniaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsigniaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
