import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMaintenance } from './supplier-maintenance';

describe('SupplierMaintenance', () => {
  let component: SupplierMaintenance;
  let fixture: ComponentFixture<SupplierMaintenance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierMaintenance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierMaintenance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
