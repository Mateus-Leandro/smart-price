import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SupplierTable } from '../../components/supplier-table/supplier-table';
import { SupplierFilterService } from '../../services/supplier-filter-service';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-supplier',
  imports: [MatCardModule, SupplierTable, FlexLayoutModule],
  templateUrl: './supplier.html',
  styleUrl: './supplier.scss',
})
export class Supplier {
  public supplierFilterService = inject(SupplierFilterService);
}
