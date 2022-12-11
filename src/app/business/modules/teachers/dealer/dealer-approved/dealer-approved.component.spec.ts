import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerApprovedComponent } from './dealer-approved.component';

describe('DealerApprovedComponent', () => {
  let component: DealerApprovedComponent;
  let fixture: ComponentFixture<DealerApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerApprovedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
