import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierFlyer } from './supplier-flyer';

describe('SupplierFlyer', () => {
  let component: SupplierFlyer;
  let fixture: ComponentFixture<SupplierFlyer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierFlyer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierFlyer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
