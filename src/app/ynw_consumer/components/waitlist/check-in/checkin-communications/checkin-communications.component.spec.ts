import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinCommunicationsComponent } from './checkin-communications.component';

describe('CheckinCommunicationsComponent', () => {
  let component: CheckinCommunicationsComponent;
  let fixture: ComponentFixture<CheckinCommunicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckinCommunicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinCommunicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
