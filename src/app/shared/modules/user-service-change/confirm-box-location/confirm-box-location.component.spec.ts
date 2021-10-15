import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBoxLocationComponent } from './confirm-box-location.component';

describe('ConfirmBoxLocationComponent', () => {
  let component: ConfirmBoxLocationComponent;
  let fixture: ComponentFixture<ConfirmBoxLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmBoxLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmBoxLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
