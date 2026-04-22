import { Injectable, signal } from '@angular/core';
import { EnumSupplierDeliveryTypeEnum } from 'src/app/core/enums/supplier.enum';

@Injectable({
  providedIn: 'root',
})
export class SupplierFilterService {
  selectedDeliveryFilterType = signal<EnumSupplierDeliveryTypeEnum | null>(null);

  getFilterDescription() {
    if (!this.selectedDeliveryFilterType()) return 'Todos';

    if (this.selectedDeliveryFilterType() === EnumSupplierDeliveryTypeEnum.BH) {
      return 'BH';
    }

    if (this.selectedDeliveryFilterType() === EnumSupplierDeliveryTypeEnum.PORTA) {
      return 'Porta';
    }

    return 'Vazios';
  }
}
