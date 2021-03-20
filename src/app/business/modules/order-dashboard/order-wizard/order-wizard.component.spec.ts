import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderWizardComponent } from './order-wizard.component';

describe('OrderWizardComponent', () => {
  let component: OrderWizardComponent;
  let fixture: ComponentFixture<OrderWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderWizardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
