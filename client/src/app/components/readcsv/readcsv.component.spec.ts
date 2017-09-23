import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadcsvComponent } from './readcsv.component';

describe('ReadcsvComponent', () => {
  let component: ReadcsvComponent;
  let fixture: ComponentFixture<ReadcsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadcsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadcsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
