import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwarenessVideosComponent } from './awareness-videos.component';

describe('AwarenessVideosComponent', () => {
  let component: AwarenessVideosComponent;
  let fixture: ComponentFixture<AwarenessVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwarenessVideosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwarenessVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
