import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ForceDialogComponent } from './force-dialog.component';

describe('ForceDialogComponent', () => {
  let component: ForceDialogComponent;
  let fixture: ComponentFixture<ForceDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
