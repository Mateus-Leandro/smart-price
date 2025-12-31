import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { passRecoveryGuard } from './pass-recovery-guard';

describe('passRecoveryGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => passRecoveryGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
