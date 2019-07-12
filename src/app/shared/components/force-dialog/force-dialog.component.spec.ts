import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceDialogComponent } from './force-dialog.component';

describe('ForceDialogComponent', () => {
  let component: ForceDialogComponent;
  let fixture: ComponentFixture<ForceDialogComponent>;

  beforeEach(async(() => {
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
