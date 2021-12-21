import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinRefundpolicyComponent } from './checkin-refundpolicy.component';

describe('CheckinRefundpolicyComponent', () => {
  let component: CheckinRefundpolicyComponent;
  let fixture: ComponentFixture<CheckinRefundpolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckinRefundpolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinRefundpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
