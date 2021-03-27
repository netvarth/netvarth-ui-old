import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishCouponComponent } from './publish-coupon.component';

describe('PublishCouponComponent', () => {
  let component: PublishCouponComponent;
  let fixture: ComponentFixture<PublishCouponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishCouponComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
