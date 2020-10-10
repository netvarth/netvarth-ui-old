import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMedicalRecordComponent } from './list-medical-record.component';

describe('ListMedicalRecordComponent', () => {
  let component: ListMedicalRecordComponent;
  let fixture: ComponentFixture<ListMedicalRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMedicalRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMedicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
