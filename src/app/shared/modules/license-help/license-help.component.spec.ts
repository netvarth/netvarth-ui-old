import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseHelpComponent } from './license-help.component';

describe('LicenseHelpComponent', () => {
  let component: LicenseHelpComponent;
  let fixture: ComponentFixture<LicenseHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
