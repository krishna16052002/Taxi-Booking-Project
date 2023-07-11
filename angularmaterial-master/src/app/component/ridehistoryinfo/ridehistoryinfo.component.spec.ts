import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidehistoryinfoComponent } from './ridehistoryinfo.component';

describe('RidehistoryinfoComponent', () => {
  let component: RidehistoryinfoComponent;
  let fixture: ComponentFixture<RidehistoryinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RidehistoryinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RidehistoryinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
