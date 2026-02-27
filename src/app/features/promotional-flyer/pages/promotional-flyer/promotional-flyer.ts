import { Component, input, signal, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { PromotionalFlyerTable } from '../../components/promotional-flyer-table/promtional-flyer-table';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TFlyerType } from 'src/app/core/models/promotional-flyer.model';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-price-records-list',
  imports: [MatCardModule, PromotionalFlyerTable, FlexLayoutModule],
  templateUrl: './promotional-flyer.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './promotional-flyer.scss',
})
export class PromotionalFlyer {
  flyerType = signal<TFlyerType | null>(null);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const typeFromRoute = this.route.snapshot.data['type'] as TFlyerType;
    this.flyerType.set(typeFromRoute);
  }
}
