import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustTemplate1Component } from './cust-template1.component';

describe('CustTemplate1Component', () => {
  let component: CustTemplate1Component;
  let fixture: ComponentFixture<CustTemplate1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustTemplate1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustTemplate1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
