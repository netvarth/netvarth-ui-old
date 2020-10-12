import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastVisitComponent } from './last-visit.component';

describe('LastVisitComponent', () => {
  let component: LastVisitComponent;
  let fixture: ComponentFixture<LastVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
