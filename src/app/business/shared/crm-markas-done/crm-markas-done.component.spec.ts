import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrmMarkasDoneComponent } from './crm-markas-done.component';


describe('CrmSelectMemberComponent', () => {
  let component: CrmMarkasDoneComponent;
  let fixture: ComponentFixture<CrmMarkasDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmMarkasDoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmMarkasDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
