import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { PromotionalFlyerProductTable } from '../../components/promotional-flyer-product-table/promotional-flyer-product-table';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Button } from 'src/app/shared/components/button/button';
import { MatDialog } from '@angular/material/dialog';
import { SuggestedPriceSettingsDialog } from 'src/app/features/settings-suggested-price/components/suggested-price-settings-dialog/suggested-price-settings-dialog';

@Component({
  selector: 'app-promotional-flyer-products',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    PromotionalFlyerProductTable,
    IconButton,
    FlexLayoutModule,
    Button,
  ],
  templateUrl: './promotional-flyer-products.html',
  styleUrl: './promotional-flyer-products.scss',
})
export class PromotionalFlyerProducts {
  id: number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.id = Number(this?.route?.snapshot?.paramMap?.get('id'));
  }

  goBack() {
    this.router.navigate(['/promotional_flyer']);
  }

  openSettingsSuggestedPriceDialog(): void {
    this.dialog.open(SuggestedPriceSettingsDialog, {
      width: '800px',
      disableClose: false,
      autoFocus: true,
    });
  }
}
