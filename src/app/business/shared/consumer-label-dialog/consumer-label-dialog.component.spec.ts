import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerLabelDialogComponent } from './consumer-label-dialog.component';

describe('ConsumerLabelDialogComponent', () => {
  let component: ConsumerLabelDialogComponent;
  let fixture: ComponentFixture<ConsumerLabelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerLabelDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerLabelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
