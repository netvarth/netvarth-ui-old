import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerAgreementComponent } from './consumer-agreement.component';

describe('ConsumerAgreementComponent', () => {
  let component: ConsumerAgreementComponent;
  let fixture: ComponentFixture<ConsumerAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerAgreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
