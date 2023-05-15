import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingActionsPopupComponent } from './booking-actions-popup.component';

describe('BookingActionsPopupComponent', () => {
  let component: BookingActionsPopupComponent;
  let fixture: ComponentFixture<BookingActionsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingActionsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingActionsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
