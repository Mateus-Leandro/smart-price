import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceProductTable } from './maintenance-product-table';

describe('MaintenanceProductTable', () => {
  let component: MaintenanceProductTable;
  let fixture: ComponentFixture<MaintenanceProductTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceProductTable],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceProductTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
