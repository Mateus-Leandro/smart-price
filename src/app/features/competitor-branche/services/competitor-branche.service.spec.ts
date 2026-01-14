import { TestBed } from '@angular/core/testing';

import { CompetitorBrancheService } from './competitor-branche.service';

describe('CompetitorBrancheService', () => {
  let service: CompetitorBrancheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetitorBrancheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
