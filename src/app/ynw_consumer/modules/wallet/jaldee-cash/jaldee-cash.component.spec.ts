import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JaldeeCashComponent } from './jaldee-cash.component';

describe('JaldeeCashComponent', () => {
  let component: JaldeeCashComponent;
  let fixture: ComponentFixture<JaldeeCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JaldeeCashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JaldeeCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
