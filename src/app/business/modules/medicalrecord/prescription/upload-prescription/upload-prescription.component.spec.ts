import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadPrescriptionComponent } from './upload-prescription.component';

describe('UploadPrescriptionComponent', () => {
  let component: UploadPrescriptionComponent;
  let fixture: ComponentFixture<UploadPrescriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPrescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
