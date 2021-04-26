import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptCardComponent } from './appt-card.component';

describe('ApptCardComponent', () => {
  let component: ApptCardComponent;
  let fixture: ComponentFixture<ApptCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApptCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApptCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
