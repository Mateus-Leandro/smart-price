import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionalFlyerProducts } from './promotional-flyer-products';

describe('PromotionalFlyerProducts', () => {
  let component: PromotionalFlyerProducts;
  let fixture: ComponentFixture<PromotionalFlyerProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionalFlyerProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionalFlyerProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
