import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigndriverComponent } from './assigndriver.component';

describe('AssigndriverComponent', () => {
  let component: AssigndriverComponent;
  let fixture: ComponentFixture<AssigndriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssigndriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssigndriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
