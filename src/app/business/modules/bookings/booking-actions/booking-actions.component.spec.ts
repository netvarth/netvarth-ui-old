import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingActionsComponent } from './booking-actions.component';

describe('BookingActionsComponent', () => {
  let component: BookingActionsComponent;
  let fixture: ComponentFixture<BookingActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
