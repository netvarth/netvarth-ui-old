import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerEmailComponent } from './consumer-email.component';

describe('ConsumerEmailComponent', () => {
  let component: ConsumerEmailComponent;
  let fixture: ComponentFixture<ConsumerEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
