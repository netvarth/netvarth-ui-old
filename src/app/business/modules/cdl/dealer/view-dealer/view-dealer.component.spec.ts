import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDealerComponent } from './view-dealer.component';

describe('ViewDealerComponent', () => {
  let component: ViewDealerComponent;
  let fixture: ComponentFixture<ViewDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDealerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
