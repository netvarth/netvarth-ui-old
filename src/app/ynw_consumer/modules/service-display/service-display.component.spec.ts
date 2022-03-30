import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDisplayComponent } from './service-display.component';

describe('ServiceDisplayComponent', () => {
  let component: ServiceDisplayComponent;
  let fixture: ComponentFixture<ServiceDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
