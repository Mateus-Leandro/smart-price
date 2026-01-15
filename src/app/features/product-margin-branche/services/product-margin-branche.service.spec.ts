import { TestBed } from '@angular/core/testing';

import { ProductMarginBrancheService } from './product-margin-branche.service';

describe('ProductMarginBrancheService', () => {
  let service: ProductMarginBrancheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductMarginBrancheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
