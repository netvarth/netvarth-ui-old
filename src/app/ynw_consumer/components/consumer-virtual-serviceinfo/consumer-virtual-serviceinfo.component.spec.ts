import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerVirtualServiceinfoComponent } from './consumer-virtual-serviceinfo.component';

describe('ConsumerVirtualServiceinfoComponent', () => {
  let component: ConsumerVirtualServiceinfoComponent;
  let fixture: ComponentFixture<ConsumerVirtualServiceinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerVirtualServiceinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerVirtualServiceinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
