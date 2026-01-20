import { Component, computed, Input, model } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { IFilterOptions } from './icon-filter-list';
import { IconButton } from '../icon-button/icon-button';

@Component({
  selector: 'app-icon-filter-button',
  imports: [MatMenuModule, MatIconModule, IconButton],
  templateUrl: './icon-filter-button.html',
  styleUrl: './icon-filter-button.scss',
})
export class IconFilterButton<T> {
  @Input() itemsOptions: IFilterOptions<T>[] = [];
  @Input() toolTipText: string = 'Filtro';
  @Input() showOptionAll: boolean = false;
  selectedFilter = model<T | null>(null);
  filterOptionsWithAll: { label: string; value: any }[] = [];

  completTollTipText = computed(() => {
    const value = this.selectedFilter();
    const selectedOption = this.filterOptionsWithAll.find((opt) => opt.value === value);
    return `${this.toolTipText}: ${selectedOption?.label || 'Todos'}`;
  });

  ngOnInit() {
    if (this.showOptionAll) {
      this.filterOptionsWithAll = [{ label: 'Todos', value: null }, ...this.itemsOptions];
    } else {
      this.filterOptionsWithAll = this.itemsOptions;
    }
  }

  getElementIcon(item: IFilterOptions<T>) {
    return this.selectedFilter() === item.value || (!this.selectedFilter() && !item.value)
      ? 'radio_button_checked'
      : 'radio_button_unchecked';
  }
}
