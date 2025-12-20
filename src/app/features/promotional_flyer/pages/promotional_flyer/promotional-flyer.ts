import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { PromotionalFlyerTable } from '../../components/promotional-flyer-table/promtional-flyer-table';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
@Component({
  selector: 'app-price-records-list',
  imports: [MatCardModule, PromotionalFlyerTable, FlexLayoutModule],
  templateUrl: './promotional-flyer.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './promotional-flyer.scss',
})
export class PromotionalFlyer {}
