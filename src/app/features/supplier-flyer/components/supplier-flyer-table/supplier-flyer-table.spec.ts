import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierFlyerTable } from './supplier-flyer-table';

describe('SupplierFlyerTable', () => {
  let component: SupplierFlyerTable;
  let fixture: ComponentFixture<SupplierFlyerTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierFlyerTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierFlyerTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
