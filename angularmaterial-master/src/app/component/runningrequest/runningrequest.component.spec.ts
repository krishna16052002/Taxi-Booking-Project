import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningrequestComponent } from './runningrequest.component';

describe('RunningrequestComponent', () => {
  let component: RunningrequestComponent;
  let fixture: ComponentFixture<RunningrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunningrequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunningrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
