import { TestBed } from '@angular/core/testing';

import { SupplierShippingPriceService } from './supplier-shipping-price.service';

describe('SupplierShippingPriceService', () => {
  let service: SupplierShippingPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierShippingPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
