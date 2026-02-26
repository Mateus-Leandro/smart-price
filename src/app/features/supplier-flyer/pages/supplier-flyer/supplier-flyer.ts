import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SupplierFlyerTable } from '../../components/supplier-flyer-table/supplier-flyer-table';

@Component({
  selector: 'app-supplier-flyer',
  imports: [MatCardModule, SupplierFlyerTable],
  templateUrl: './supplier-flyer.html',
  styleUrl: './supplier-flyer.scss',
})
export class SupplierFlyer {}
