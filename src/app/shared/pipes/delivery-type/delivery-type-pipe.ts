import { Pipe, PipeTransform } from '@angular/core';
import { EnumSupplierDeliveryTypeEnum } from 'src/app/core/enums/supplier.enum';

@Pipe({
  name: 'deliveryType',
})
export class DeliveryTypePipe implements PipeTransform {
  transform(value: EnumSupplierDeliveryTypeEnum): string {
    if (!value) return '';

    switch (value) {
      case EnumSupplierDeliveryTypeEnum.BH:
        return 'BH';
      case EnumSupplierDeliveryTypeEnum.PORTA:
        return 'PORTA';
      default:
        return '';
    }
  }
}
