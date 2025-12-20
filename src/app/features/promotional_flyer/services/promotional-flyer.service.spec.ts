import { TestBed } from '@angular/core/testing';

import { PromotionalFlyerService } from './promotional-flyer.service.js';

describe('PromotionalFlyerServiceTs', () => {
  let service: PromotionalFlyerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromotionalFlyerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
