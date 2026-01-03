import { Component } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MaintenanceProductTable } from '../../components/maintenance-product-table/maintenance-product-table';

@Component({
  selector: 'app-product-maintenance',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MaintenanceProductTable],
  templateUrl: './product-maintenance.html',
  styleUrl: './product-maintenance.scss',
})
export class ProductMaintenance {}
