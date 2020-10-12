import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalnotesComponent } from './clinicalnotes.component';

describe('ClinicalnotesComponent', () => {
  let component: ClinicalnotesComponent;
  let fixture: ComponentFixture<ClinicalnotesComponent>;

  beforeEach(async(() => {
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
