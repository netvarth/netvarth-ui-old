import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JaldeeVideoSettingsComponent } from './jaldee-video-settings.component';

describe('JaldeeVideoSettingsComponent', () => {
  let component: JaldeeVideoSettingsComponent;
  let fixture: ComponentFixture<JaldeeVideoSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JaldeeVideoSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JaldeeVideoSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
