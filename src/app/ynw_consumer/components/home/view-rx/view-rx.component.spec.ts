import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRxComponent } from './view-rx.component';

describe('ViewRxComponent', () => {
  let component: ViewRxComponent;
  let fixture: ComponentFixture<ViewRxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
