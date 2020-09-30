import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueSelectionComponent } from './queue-selection.component';

describe('QueueSelectionComponent', () => {
  let component: QueueSelectionComponent;
  let fixture: ComponentFixture<QueueSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
