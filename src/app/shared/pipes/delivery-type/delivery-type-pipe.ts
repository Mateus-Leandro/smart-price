import { Pipe, PipeTransform } from '@angular/core';
import { SupplierDeliveryTypeEnum } from 'src/app/core/enums/supplier.enum';

@Pipe({
  name: 'deliveryType',
})
export class DeliveryTypePipe implements PipeTransform {
  transform(value: SupplierDeliveryTypeEnum): string {
    if (!value) return '';

    switch (value) {
      case SupplierDeliveryTypeEnum.BH:
        return 'BH';
      case SupplierDeliveryTypeEnum.PORTA:
        return 'PORTA';
      default:
        return '';
    }
  }
}
