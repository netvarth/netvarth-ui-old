import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLetterComponent } from './document-letter.component';

describe('DocumentLetterComponent', () => {
  let component: DocumentLetterComponent;
  let fixture: ComponentFixture<DocumentLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentLetterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
