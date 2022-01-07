import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationServicesComponent } from './donation-services.component';

describe('DonationServicesComponent', () => {
  let component: DonationServicesComponent;
  let fixture: ComponentFixture<DonationServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
