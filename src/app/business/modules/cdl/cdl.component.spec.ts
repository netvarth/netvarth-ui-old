import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdlComponent } from './cdl.component';

describe('CdlComponent', () => {
  let component: CdlComponent;
  let fixture: ComponentFixture<CdlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CdlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
