import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiceSelectionComponent } from './service-selection.component';

describe('ServiceSelectionComponent', () => {
  let component: ServiceSelectionComponent;
  let fixture: ComponentFixture<ServiceSelectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
