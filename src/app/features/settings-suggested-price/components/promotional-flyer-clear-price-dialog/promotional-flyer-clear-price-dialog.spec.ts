import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionalFlyerClearPriceDialog } from './promotional-flyer-clear-price-dialog';

describe('PromotionalFlyerClearPriceDialog', () => {
  let component: PromotionalFlyerClearPriceDialog;
  let fixture: ComponentFixture<PromotionalFlyerClearPriceDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionalFlyerClearPriceDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionalFlyerClearPriceDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
