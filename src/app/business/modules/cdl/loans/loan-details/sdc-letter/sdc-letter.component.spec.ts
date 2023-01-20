import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdcLetterComponent } from './sdc-letter.component';

describe('SdcLetterComponent', () => {
  let component: SdcLetterComponent;
  let fixture: ComponentFixture<SdcLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdcLetterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdcLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
