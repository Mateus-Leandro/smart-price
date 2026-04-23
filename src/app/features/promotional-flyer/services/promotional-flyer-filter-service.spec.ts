import { TestBed } from '@angular/core/testing';

import { PromotionalFlyerFilterService } from './promotional-flyer-filter-service';

describe('PromotionalFlyerFilterService', () => {
  let service: PromotionalFlyerFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromotionalFlyerFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
