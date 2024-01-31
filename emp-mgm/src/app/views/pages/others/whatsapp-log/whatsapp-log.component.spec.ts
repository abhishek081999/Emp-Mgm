import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappLogComponent } from './whatsapp-log.component';

describe('WhatsappLogComponent', () => {
  let component: WhatsappLogComponent;
  let fixture: ComponentFixture<WhatsappLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
