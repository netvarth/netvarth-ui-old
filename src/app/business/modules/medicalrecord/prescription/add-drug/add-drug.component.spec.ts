import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddDrugComponent } from './add-drug.component';

describe('AddDrugComponent', () => {
  let component: AddDrugComponent;
  let fixture: ComponentFixture<AddDrugComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDrugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDrugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
