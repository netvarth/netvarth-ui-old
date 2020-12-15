import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemNotesComponent } from './add-item-notes.component';

describe('AddItemNotesComponent', () => {
  let component: AddItemNotesComponent;
  let fixture: ComponentFixture<AddItemNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
