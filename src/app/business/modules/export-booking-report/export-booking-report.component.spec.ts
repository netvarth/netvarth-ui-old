import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportBookingReportComponent } from './export-booking-report.component';

describe('ExportBookingReportComponent', () => {
  let component: ExportBookingReportComponent;
  let fixture: ComponentFixture<ExportBookingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportBookingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
