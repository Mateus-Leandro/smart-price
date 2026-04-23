import { Injectable, signal } from '@angular/core';
import { FlyerFilterValue, getFlyerFilterOptions } from 'src/app/core/enums/flyer.enum';
import { TFlyerType } from 'src/app/core/models/promotional-flyer.model';

@Injectable({
  providedIn: 'root',
})
export class PromotionalFlyerFilterService {
  selectedFilterType = signal<null | FlyerFilterValue>(null);

  getSelectedFilter(type: TFlyerType): FlyerFilterValue | null {
    const selected = this.selectedFilterType();

    if (!selected) {
      return null;
    }

    const validOptions = getFlyerFilterOptions(type).map((opt) => opt.value);
    return validOptions.includes(selected) ? selected : null;
  }
}
