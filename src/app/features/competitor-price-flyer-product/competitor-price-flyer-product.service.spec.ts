import { TestBed } from '@angular/core/testing';

import { CompetitorPriceFlyerProductService } from './competitor-price-flyer-product.service';

describe('CompetitorPriceFlyerProductService', () => {
  let service: CompetitorPriceFlyerProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetitorPriceFlyerProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
