import { Component, model } from '@angular/core';
import { MatFormField, MatLabel, MatSelect } from '@angular/material/select';
import { SupplierDeliveryTypeEnum } from '../../enums/supplier-delivery-type.enum';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-supplier-delivery-select',
  imports: [MatFormField, MatLabel, MatSelect, MatAutocompleteModule],
  templateUrl: './supplier-delivery-select.html',
  styleUrl: './supplier-delivery-select.scss',
})
export class SupplierDeliverySelect {
  selectedValue = model<SupplierDeliveryTypeEnum>();

  public SupplierDeliveryTypeList = Object.entries(SupplierDeliveryTypeEnum).map(
    ([key, value]) => ({
      label: key,
      value: value,
    }),
  );
}
