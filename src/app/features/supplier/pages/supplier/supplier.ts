import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SupplierTable } from '../../components/supplier-table/supplier-table';

@Component({
  selector: 'app-supplier',
  imports: [MatCardModule, SupplierTable],
  templateUrl: './supplier.html',
  styleUrl: './supplier.scss',
})
export class Supplier {}
