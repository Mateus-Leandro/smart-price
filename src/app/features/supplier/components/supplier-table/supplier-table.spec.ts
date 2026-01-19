import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierTable } from './supplier-table';

describe('SupplierTable', () => {
  let component: SupplierTable;
  let fixture: ComponentFixture<SupplierTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
