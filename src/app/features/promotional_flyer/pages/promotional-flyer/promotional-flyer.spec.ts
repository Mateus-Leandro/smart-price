import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionalFlyer } from './promotional-flyer';

describe('PromotionalFlyer', () => {
  let component: PromotionalFlyer;
  let fixture: ComponentFixture<PromotionalFlyer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionalFlyer],
    }).compileComponents();

    fixture = TestBed.createComponent(PromotionalFlyer);
    fixture = TestBed.createComponent(PromotionalFlyer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
