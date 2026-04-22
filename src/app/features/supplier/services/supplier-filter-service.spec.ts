import { TestBed } from '@angular/core/testing';

import { SupplierFilterService } from './supplier-filter-service';

describe('SupplierFilterService', () => {
  let service: SupplierFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
