import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateAsCalendarComponent } from './date-as-calendar.component';

describe('DateAsCalendarComponent', () => {
  let component: DateAsCalendarComponent;
  let fixture: ComponentFixture<DateAsCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateAsCalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateAsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
