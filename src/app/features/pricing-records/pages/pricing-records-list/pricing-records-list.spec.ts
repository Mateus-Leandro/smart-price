import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingRecordsList } from './pricing-records-list';

describe('PricingRecordsList', () => {
  let component: PricingRecordsList;
  let fixture: ComponentFixture<PricingRecordsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingRecordsList],
    }).compileComponents();

    fixture = TestBed.createComponent(PricingRecordsList);
    fixture = TestBed.createComponent(PricingRecordsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
