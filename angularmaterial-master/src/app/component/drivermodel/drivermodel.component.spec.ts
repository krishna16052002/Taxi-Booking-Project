import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivermodelComponent } from './drivermodel.component';

describe('DrivermodelComponent', () => {
  let component: DrivermodelComponent;
  let fixture: ComponentFixture<DrivermodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrivermodelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrivermodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
