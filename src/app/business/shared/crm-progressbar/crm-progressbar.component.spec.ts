import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrmProgressbarComponent } from './crm-progressbar.component';


describe('CrmProgressbarComponent', () => {
  let component: CrmProgressbarComponent;
  let fixture: ComponentFixture<CrmProgressbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmProgressbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
