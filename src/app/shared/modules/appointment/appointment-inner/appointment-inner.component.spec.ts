import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentInnerComponent } from './appointment-inner.component';

describe('AppointmentInnerComponent', () => {
  let component: AppointmentInnerComponent;
  let fixture: ComponentFixture<AppointmentInnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentInnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
