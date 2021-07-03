import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClinicalnotesComponent } from './clinicalnotes.component';

describe('ClinicalnotesComponent', () => {
  let component: ClinicalnotesComponent;
  let fixture: ComponentFixture<ClinicalnotesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalnotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalnotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
