import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedPriceSettingsDialog } from './suggested-price-settings-dialog';

describe('SuggestedPriceSettingsDialog', () => {
  let component: SuggestedPriceSettingsDialog;
  let fixture: ComponentFixture<SuggestedPriceSettingsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestedPriceSettingsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestedPriceSettingsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
