import { TestBed } from '@angular/core/testing';

import { SupplierFlyerService } from './supplier-flyer.service';

describe('SupplierFlyerService', () => {
  let service: SupplierFlyerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierFlyerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
