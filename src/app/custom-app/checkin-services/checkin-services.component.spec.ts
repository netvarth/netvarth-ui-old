import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinServicesComponent } from './checkin-services.component';

describe('CheckinServicesComponent', () => {
  let component: CheckinServicesComponent;
  let fixture: ComponentFixture<CheckinServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckinServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
