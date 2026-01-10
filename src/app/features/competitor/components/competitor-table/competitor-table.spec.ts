import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitorTable } from './competitor-table';

describe('CompetitorTable', () => {
  let component: CompetitorTable;
  let fixture: ComponentFixture<CompetitorTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitorTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitorTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
