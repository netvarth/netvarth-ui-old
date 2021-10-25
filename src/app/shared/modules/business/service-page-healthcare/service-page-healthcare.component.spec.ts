import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePageHealthcareComponent } from './service-page-healthcare.component';

describe('ServicePageHealthcareComponent', () => {
  let component: ServicePageHealthcareComponent;
  let fixture: ComponentFixture<ServicePageHealthcareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicePageHealthcareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePageHealthcareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
