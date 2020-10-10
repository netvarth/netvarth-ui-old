import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRxComponent } from './add-rx.component';

describe('AddRxComponent', () => {
  let component: AddRxComponent;
  let fixture: ComponentFixture<AddRxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
