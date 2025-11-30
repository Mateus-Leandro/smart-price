import { Component, signal } from '@angular/core';
import { PriceRecordsList } from "./features/pricing-records/pages/price-records-list/price-records-list";
@Component({
  selector: 'app-root',
  imports: [PriceRecordsList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
