import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinMembersComponent } from './checkin-members.component';

describe('CheckinMembersComponent', () => {
  let component: CheckinMembersComponent;
  let fixture: ComponentFixture<CheckinMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckinMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
