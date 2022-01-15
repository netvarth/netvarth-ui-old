import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsDepartmentsComponent } from './cons-departments.component';

describe('ConsDepartmentsComponent', () => {
  let component: ConsDepartmentsComponent;
  let fixture: ComponentFixture<ConsDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsDepartmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
