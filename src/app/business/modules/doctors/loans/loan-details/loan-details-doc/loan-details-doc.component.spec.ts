import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDetailsDocComponent } from './loan-details-doc.component';

describe('LoanDetailsDocComponent', () => {
  let component: LoanDetailsDocComponent;
  let fixture: ComponentFixture<LoanDetailsDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanDetailsDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDetailsDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
