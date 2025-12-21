import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionalFlyerProductTable } from './promotional-flyer-product-table';

describe('PromotionalFlyerProductTable', () => {
  let component: PromotionalFlyerProductTable;
  let fixture: ComponentFixture<PromotionalFlyerProductTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionalFlyerProductTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionalFlyerProductTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
