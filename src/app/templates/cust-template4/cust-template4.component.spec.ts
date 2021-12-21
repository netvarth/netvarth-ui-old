import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustTemplate4Component } from './cust-template4.component';

describe('CustTemplate4Component', () => {
  let component: CustTemplate4Component;
  let fixture: ComponentFixture<CustTemplate4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustTemplate4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustTemplate4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
