import { Component, signal } from '@angular/core';
import { PricingRecordsList } from './features/pricing-records/pages/pricing-records-list/pricing-records-list';
@Component({
  selector: 'app-root',
  imports: [PricingRecordsList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
