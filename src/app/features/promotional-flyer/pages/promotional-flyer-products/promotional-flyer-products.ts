import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { PromotionalFlyerProductTable } from '../../components/promotional-flyer-product-table/promotional-flyer-product-table';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Button } from 'src/app/shared/components/button/button';
import { MatDialog } from '@angular/material/dialog';
import { SuggestedPriceSettingsDialog } from 'src/app/features/settings-suggested-price/components/suggested-price-settings-dialog/suggested-price-settings-dialog';
import { ConfirmationDialog } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PromotionalFlyerService } from '../../services/promotional-flyer.service';

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
  @ViewChild(PromotionalFlyerProductTable)
  flyerTable!: PromotionalFlyerProductTable;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private promotionalFlyerService: PromotionalFlyerService,
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

  aplySuggestedPrice() {
    this.dialog
      .open(ConfirmationDialog, {
        width: '400px',
        disableClose: true,
        autoFocus: true,
        data: {
          titleText: 'Utilizar preço sugerido',
          messageText:
            'Utilizar o preço de venda sugerido e o preço fidelidade sugerido em todos os itens?',
          confirmationText: 'Sim',
          cancelText: 'Não',
          confirmationColor: 'var(--primary)',
        },
      })
      .afterClosed()
      .subscribe((confirmation) => {
        if (confirmation) {
          this.promotionalFlyerService.applySuggestedPrices(this.id).subscribe({
            next: () => {
              this.flyerTable.reload();
              this.notificationService.showSuccess(`Preços atualizados com sucesso!`);
            },
            error: (err) => {
              this.notificationService.showError(
                `Erro ao utilizar preços sugeridos: ${err.message || err}`,
              );
            },
          });
        }
      });
  }
}
