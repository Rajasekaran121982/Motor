import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLogoutButtonComponentComponent } from './shared-logout-button-component.component';

describe('SharedLogoutButtonComponentComponent', () => {
  let component: SharedLogoutButtonComponentComponent;
  let fixture: ComponentFixture<SharedLogoutButtonComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedLogoutButtonComponentComponent]
    });
    fixture = TestBed.createComponent(SharedLogoutButtonComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
