import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmSelectMemberComponent } from './crm-select-member.component';

describe('CrmSelectMemberComponent', () => {
  let component: CrmSelectMemberComponent;
  let fixture: ComponentFixture<CrmSelectMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmSelectMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmSelectMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
