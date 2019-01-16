import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderReimburseReportComponent } from './provider-reimburse-report.component';

describe('ProviderReimburseReportComponent', () => {
  let component: ProviderReimburseReportComponent;
  let fixture: ComponentFixture<ProviderReimburseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderReimburseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderReimburseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
