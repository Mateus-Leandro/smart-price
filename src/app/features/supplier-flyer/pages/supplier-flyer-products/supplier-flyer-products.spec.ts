import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierFlyerProducts } from './supplier-flyer-products';

describe('SupplierFlyerProducts', () => {
  let component: SupplierFlyerProducts;
  let fixture: ComponentFixture<SupplierFlyerProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierFlyerProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierFlyerProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
