import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryBannedComponent } from './temporary-banned.component';

describe('TemporaryBannedComponent', () => {
  let component: TemporaryBannedComponent;
  let fixture: ComponentFixture<TemporaryBannedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemporaryBannedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryBannedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
