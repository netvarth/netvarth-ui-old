import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpdcLetterComponent } from './spdc-letter.component';

describe('SpdcLetterComponent', () => {
  let component: SpdcLetterComponent;
  let fixture: ComponentFixture<SpdcLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpdcLetterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpdcLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
