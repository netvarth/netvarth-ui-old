import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinPrivacyComponent } from './checkin-privacy.component';

describe('CheckinPrivacyComponent', () => {
  let component: CheckinPrivacyComponent;
  let fixture: ComponentFixture<CheckinPrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckinPrivacyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
