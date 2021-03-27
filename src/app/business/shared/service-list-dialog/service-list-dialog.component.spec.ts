import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceListDialogComponent } from './service-list-dialog.component';

describe('ServiceListDialogComponent', () => {
  let component: ServiceListDialogComponent;
  let fixture: ComponentFixture<ServiceListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
