import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionSelectComponent } from './prescription-select.component';

describe('PrescriptionSelectComponent', () => {
  let component: PrescriptionSelectComponent;
  let fixture: ComponentFixture<PrescriptionSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrescriptionSelectComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
