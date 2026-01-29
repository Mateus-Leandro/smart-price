import { TestBed } from '@angular/core/testing';

import { SuggestedPriceSettingService } from './suggested-price-setting.service';

describe('SuggestedPriceSettingService', () => {
  let service: SuggestedPriceSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuggestedPriceSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
