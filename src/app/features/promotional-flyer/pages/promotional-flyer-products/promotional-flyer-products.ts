import { Component, inject, signal, ViewChild } from '@angular/core';
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
import { IPromotionalFlyerView, TFlyerType } from 'src/app/core/models/promotional-flyer.model';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { LoadingService } from 'src/app/core/services/loading.service';
import { IUserPermission } from 'src/app/core/models/user-permission.model';
import { UserPermissionService } from 'src/app/features/user-permission/user-permission.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { EnumFilterPromotionalFlyerProducts } from 'src/app/core/enums/product.enum';
import { ISupplierFlyerView } from 'src/app/core/models/supplier-flyer.model';
import { SupplierFlyerService } from 'src/app/features/supplier-flyer/services/supplier-flyer.service';

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
    Spinner,
    MatIcon,
  ],
  templateUrl: './promotional-flyer-products.html',
  styleUrl: './promotional-flyer-products.scss',
})
export class PromotionalFlyerProducts {
  userPermissions: IUserPermission | null = null;
  loading = inject(LoadingService).loading;
  flyerInfo = signal<IPromotionalFlyerView | ISupplierFlyerView | undefined>(undefined);
  readonly FilterPromotionalFlyerProductsEnum = EnumFilterPromotionalFlyerProducts;
  id = signal<number>(0);
  flyerType = signal<TFlyerType | null>(null);

  @ViewChild(PromotionalFlyerProductTable)
  flyerTable: PromotionalFlyerProductTable | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private promotionalFlyerService: PromotionalFlyerService,
    private userPermissionService: UserPermissionService,
    private authService: AuthService,
    private supplierFlyerService: SupplierFlyerService,
  ) {}

  ngOnInit() {
    const typeFromRoute = this.route.snapshot.data['type'] as 'quote' | 'supplier';
    this.flyerType.set(typeFromRoute);

    const routeId = Number(this.route.snapshot.paramMap.get('id'));
    this.id.set(routeId);

    this.authService.getUser().subscribe({
      next: (user) => {
        this.userPermissionService.getPermissions(user.id).subscribe({
          next: (permissions) => {
            this.userPermissions = permissions;
          },
          error: (err) => {
            this.notificationService.showError(
              `Erro ao buscar permissões do usuário: ${err.message || err}`,
            );
          },
        });
      },
      error: (err) => {
        this.notificationService.showError(`Erro ao buscar usuário: ${err.message || err}`);
      },
    });

    this.loadFlyerInfo();
  }

  goBack() {
    this.router.navigate(['/promotional_flyer', this.flyerType()]);
  }

  openSettingsSuggestedPriceDialog(): void {
    this.dialog
      .open(SuggestedPriceSettingsDialog, {
        width: '800px',
        disableClose: false,
        autoFocus: true,
        data: {
          flyerInfo: this.flyerInfo(),
          companyId: this.flyerTable?.companyId,
          competitorType: 'competitor_price_flyer_products',
        },
      })
      .afterClosed()
      .subscribe(() => {
        this?.flyerTable?.loadData();
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
            this?.flyerTable?.selectedFilterType() ===
            EnumFilterPromotionalFlyerProducts.NoCompetitorPrice
              ? 'Utilizar o preço de venda e o preço fidelidade sugerido? (SOMENTE NOS ITENS QUE NÃO POSSUEM PREÇO DOS CONCORRENTES)'
              : 'Utilizar o preço de venda e o preço fidelidade sugerido? (SOMENTE NOS ITENS QUE POSSUEM PREÇO DOS CONCORRENTES NA LOJA VINCULADA)',
          confirmationText: 'Sim',
          cancelText: 'Não',
          confirmationColor: 'var(--primary)',
        },
      })
      .afterClosed()
      .subscribe((confirmation) => {
        if (confirmation) {
          this.promotionalFlyerService
            .applySuggestedPrices(
              this.id(),
              this?.flyerTable?.selectedFilterType() ===
                EnumFilterPromotionalFlyerProducts.NoCompetitorPrice,
            )
            .subscribe({
              next: () => {
                this?.flyerTable?.reload();
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

  private loadFlyerInfo() {
    const paginatorFlyer = {
      pageIndex: 0,
      pageSize: 1,
      records: {
        count: 0,
        data: [],
      },
    };

    this.getFlyerService()
      .loadFlyers(paginatorFlyer, '', this.id())
      .subscribe({
        next: (flyer: any) => {
          this.flyerInfo.set(flyer.data[0]);
        },
        error: (err: any) => {
          this.notificationService.showError(`Erro ao buscar informações: ${err}`);
        },
      });
  }

  getFlyerService(): any {
    return this.flyerType() === 'quote' ? this.promotionalFlyerService : this.supplierFlyerService;
  }
}
