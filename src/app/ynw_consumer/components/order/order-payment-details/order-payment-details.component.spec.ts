import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentDetailsComponent } from './order-payment-details.component';

describe('OrderPaymentDetailsComponent', () => {
  let component: OrderPaymentDetailsComponent;
  let fixture: ComponentFixture<OrderPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderPaymentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
