import { Component, model } from '@angular/core';
import { MatFormField, MatLabel, MatSelect } from '@angular/material/select';
import { EnumSupplierDeliveryTypeEnum } from '../../../../core/enums/supplier.enum';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-supplier-delivery-select',
  imports: [MatFormField, MatLabel, MatSelect, MatAutocompleteModule, MatIconModule],
  templateUrl: './supplier-delivery-select.html',
  styleUrl: './supplier-delivery-select.scss',
})
export class SupplierDeliverySelect {
  selectedValue = model<EnumSupplierDeliveryTypeEnum>();

  public SupplierDeliveryTypeList = Object.entries(EnumSupplierDeliveryTypeEnum).map(
    ([key, value]) => ({
      label: key,
      value: value,
    }),
  );
}
