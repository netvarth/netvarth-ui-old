import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerGroupDialogComponent } from './consumer-group-dialog.component';

describe('ConsumerGroupDialogComponent', () => {
  let component: ConsumerGroupDialogComponent;
  let fixture: ComponentFixture<ConsumerGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerGroupDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
