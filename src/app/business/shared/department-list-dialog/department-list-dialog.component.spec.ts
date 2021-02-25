import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentListDialogComponent } from './department-list-dialog.component';

describe('DepartmentListDialogComponent', () => {
  let component: DepartmentListDialogComponent;
  let fixture: ComponentFixture<DepartmentListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
