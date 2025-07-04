import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationAutomaticCanelComponent } from './reservation-automatic-canel.component';

describe('ReservationAutomaticCanelComponent', () => {
  let component: ReservationAutomaticCanelComponent;
  let fixture: ComponentFixture<ReservationAutomaticCanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationAutomaticCanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationAutomaticCanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
