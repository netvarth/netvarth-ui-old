import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteBoxComponent } from './confirm-delete-box.component';

describe('ConfirmDeleteBoxComponent', () => {
  let component: ConfirmDeleteBoxComponent;
  let fixture: ComponentFixture<ConfirmDeleteBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
