import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideinfoComponent } from './rideinfo.component';

describe('RideinfoComponent', () => {
  let component: RideinfoComponent;
  let fixture: ComponentFixture<RideinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RideinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
