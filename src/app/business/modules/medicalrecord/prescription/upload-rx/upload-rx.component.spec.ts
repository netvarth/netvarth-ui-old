import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRxComponent } from './upload-rx.component';

describe('UploadRxComponent', () => {
  let component: UploadRxComponent;
  let fixture: ComponentFixture<UploadRxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadRxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
