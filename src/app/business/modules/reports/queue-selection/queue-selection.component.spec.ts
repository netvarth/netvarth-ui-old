import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QueueSelectionComponent } from './queue-selection.component';

describe('QueueSelectionComponent', () => {
  let component: QueueSelectionComponent;
  let fixture: ComponentFixture<QueueSelectionComponent>;

  beforeEach(waitForAsync(() => {
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
