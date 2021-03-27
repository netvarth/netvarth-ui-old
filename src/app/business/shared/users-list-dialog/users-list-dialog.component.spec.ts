import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListDialogComponent } from './users-list-dialog.component';

describe('UsersListDialogComponent', () => {
  let component: UsersListDialogComponent;
  let fixture: ComponentFixture<UsersListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
