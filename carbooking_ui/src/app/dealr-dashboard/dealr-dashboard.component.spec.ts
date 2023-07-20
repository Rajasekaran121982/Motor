import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealrDashboardComponent } from './dealr-dashboard.component';

describe('DealrDashboardComponent', () => {
  let component: DealrDashboardComponent;
  let fixture: ComponentFixture<DealrDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealrDashboardComponent]
    });
    fixture = TestBed.createComponent(DealrDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
