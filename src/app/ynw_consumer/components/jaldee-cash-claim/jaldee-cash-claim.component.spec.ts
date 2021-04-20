import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JaldeeCashClaimComponent } from './jaldee-cash-claim.component';

describe('JaldeeCashClaimComponent', () => {
  let component: JaldeeCashClaimComponent;
  let fixture: ComponentFixture<JaldeeCashClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JaldeeCashClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JaldeeCashClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
