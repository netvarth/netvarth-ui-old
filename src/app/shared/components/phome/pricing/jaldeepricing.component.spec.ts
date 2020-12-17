import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JaldeepricingComponent } from './jaldeepricing.component';

describe('JaldeepricingComponent', () => {
  let component: JaldeepricingComponent;
  let fixture: ComponentFixture<JaldeepricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JaldeepricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JaldeepricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
