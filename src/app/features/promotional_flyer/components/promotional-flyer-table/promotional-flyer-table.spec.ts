import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromotionalFlyerTable } from './promtional-flyer-table';

describe('PromotionalFlyerTable', () => {
  let component: PromotionalFlyerTable;
  let fixture: ComponentFixture<PromotionalFlyerTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionalFlyerTable],
    }).compileComponents();

    fixture = TestBed.createComponent(PromotionalFlyerTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
