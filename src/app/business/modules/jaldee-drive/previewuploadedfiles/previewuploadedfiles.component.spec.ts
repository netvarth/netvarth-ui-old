import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewuploadedfilesComponent } from './previewuploadedfiles.component';

describe('PreviewuploadedfilesComponent', () => {
  let component: PreviewuploadedfilesComponent;
  let fixture: ComponentFixture<PreviewuploadedfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewuploadedfilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewuploadedfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
