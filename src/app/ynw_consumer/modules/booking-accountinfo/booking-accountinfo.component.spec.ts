import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingAccountinfoComponent } from './booking-accountinfo.component';

describe('BookingAccountinfoComponent', () => {
  let component: BookingAccountinfoComponent;
  let fixture: ComponentFixture<BookingAccountinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingAccountinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAccountinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
