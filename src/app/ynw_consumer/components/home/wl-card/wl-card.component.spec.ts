import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WlCardComponent } from './wl-card.component';

describe('WlCardComponent', () => {
  let component: WlCardComponent;
  let fixture: ComponentFixture<WlCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WlCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WlCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
