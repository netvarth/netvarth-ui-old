import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderFilesComponent } from './folder-files.component';

describe('FolderFilesComponent', () => {
  let component: FolderFilesComponent;
  let fixture: ComponentFixture<FolderFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
