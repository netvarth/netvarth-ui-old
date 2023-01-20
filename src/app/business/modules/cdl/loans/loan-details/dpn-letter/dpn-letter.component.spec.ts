import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpnLetterComponent } from './dpn-letter.component';

describe('DpnLetterComponent', () => {
  let component: DpnLetterComponent;
  let fixture: ComponentFixture<DpnLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpnLetterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpnLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
