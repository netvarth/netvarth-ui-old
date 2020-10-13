import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RxHomeComponent } from './rx-home.component';

describe('RxHomeComponent', () => {
  let component: RxHomeComponent;
  let fixture: ComponentFixture<RxHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RxHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RxHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
