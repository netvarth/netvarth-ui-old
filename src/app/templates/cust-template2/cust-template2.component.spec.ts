import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustTemplate2Component } from './cust-template2.component';

describe('CustTemplate2Component', () => {
  let component: CustTemplate2Component;
  let fixture: ComponentFixture<CustTemplate2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustTemplate2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustTemplate2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
