import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMaintenance } from './product-maintenance';

describe('ProductMaintenance', () => {
  let component: ProductMaintenance;
  let fixture: ComponentFixture<ProductMaintenance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductMaintenance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMaintenance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
