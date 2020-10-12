import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareRxComponent } from './share-rx.component';

describe('ShareRxComponent', () => {
  let component: ShareRxComponent;
  let fixture: ComponentFixture<ShareRxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareRxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareRxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
