import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierDeliverySelect } from './supplier-delivery-select';

describe('SupplierDeliverySelect', () => {
  let component: SupplierDeliverySelect;
  let fixture: ComponentFixture<SupplierDeliverySelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierDeliverySelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierDeliverySelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
