import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceRecordsListTable } from './price-records-list-table';

describe('PriceRecordsListTable', () => {
  let component: PriceRecordsListTable;
  let fixture: ComponentFixture<PriceRecordsListTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceRecordsListTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceRecordsListTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
