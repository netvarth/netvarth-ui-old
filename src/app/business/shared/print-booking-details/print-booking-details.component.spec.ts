import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBookingDetailsComponent } from './print-booking-details.component';

describe('PrintBookingDetailsComponent', () => {
  let component: PrintBookingDetailsComponent;
  let fixture: ComponentFixture<PrintBookingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintBookingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintBookingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
