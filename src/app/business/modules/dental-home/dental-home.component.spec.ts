import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalHomeComponent } from './dental-home.component';

describe('DentalHomeComponent', () => {
  let component: DentalHomeComponent;
  let fixture: ComponentFixture<DentalHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DentalHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DentalHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
