import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDigitalSignatureComponent } from './upload-digital-signature.component';

describe('UploadDigitalSignatureComponent', () => {
  let component: UploadDigitalSignatureComponent;
  let fixture: ComponentFixture<UploadDigitalSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDigitalSignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDigitalSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
