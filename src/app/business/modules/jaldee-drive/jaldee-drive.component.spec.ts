import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JaldeeDriveComponent } from './jaldee-drive.component';

describe('JaldeeDriveComponent', () => {
  let component: JaldeeDriveComponent;
  let fixture: ComponentFixture<JaldeeDriveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JaldeeDriveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JaldeeDriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
