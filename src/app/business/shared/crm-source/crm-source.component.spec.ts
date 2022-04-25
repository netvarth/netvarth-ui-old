import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmSourceComponent } from './crm-source.component';

describe('CrmSourceComponent', () => {
  let component: CrmSourceComponent;
  let fixture: ComponentFixture<CrmSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
