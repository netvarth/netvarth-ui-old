import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSelectionComponent } from './schedule-selection.component';

describe('ScheduleSelectionComponent', () => {
  let component: ScheduleSelectionComponent;
  let fixture: ComponentFixture<ScheduleSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
