import { TestBed } from '@angular/core/testing';

import { CompanyBrancheService } from './company-branche.service';

describe('CompanyBrancheService', () => {
  let service: CompanyBrancheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyBrancheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
