import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdermanagerComponent } from './ordermanager.component';

describe('OrdermanagerComponent', () => {
  let component: OrdermanagerComponent;
  let fixture: ComponentFixture<OrdermanagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdermanagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdermanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
