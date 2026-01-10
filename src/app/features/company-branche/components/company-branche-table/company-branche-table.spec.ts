import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBrancheTable } from './company-branche-table';

describe('CompanyBrancheTable', () => {
  let component: CompanyBrancheTable;
  let fixture: ComponentFixture<CompanyBrancheTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyBrancheTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyBrancheTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
