import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSetListComponent } from './question-set-list.component';

describe('QuestionSetListComponent', () => {
  let component: QuestionSetListComponent;
  let fixture: ComponentFixture<QuestionSetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSetListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
