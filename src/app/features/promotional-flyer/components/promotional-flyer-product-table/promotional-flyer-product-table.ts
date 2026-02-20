import {
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  Input,
  QueryList,
  signal,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { merge, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { PromotionalFlyerService } from '../../services/promotional-flyer.service';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MatTooltip } from '@angular/material/tooltip';
import {
  EnumFilterPromotionalFlyerProducts,
  EnumWarningProductType,
  getPromotionalFlyerProductsFilterOptions,
  MarginFilterEnum,
  ProductPriceType,
} from '../../../../core/enums/product.enum';
import {
  IPromotionalFlyerProductsView,
  IPromotionalFlyerView,
} from 'src/app/core/models/promotional-flyer.model';
import { CompetitorService } from 'src/app/features/competitor/services/competitor.service';
import { ICompetitor, ICompetitorView } from 'src/app/core/models/competitor';
import { CompetitorPriceFlyerProductService } from 'src/app/features/competitor-price-flyer-product/competitor-price-flyer-product.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { roundToTwo, transformToNumberValue } from 'src/app/shared/functions/utils';
import { SuggestedPriceSettingService } from 'src/app/features/settings-suggested-price/services/suggested-price-setting.service';
import { ISuggestedPriceSettingView } from 'src/app/core/models/suggested-price-setting.model';
import { MatDivider } from '@angular/material/divider';
import { EnumSupplierDeliveryTypeEnum } from 'src/app/core/enums/supplier.enum';
import { IUserPermission } from 'src/app/core/models/user-permission.model';
import { UserPermissionService } from 'src/app/features/user-permission/user-permission.service';
import { IconFilterButton } from 'src/app/shared/components/icon-filter-button/icon-filter-button';
import { IFilterOptions } from 'src/app/shared/components/icon-filter-button/icon-filter-list';

type FlyerRowForm = FormGroup<{
  actualSalePrice: FormControl<string | null>;
  salePrice: FormControl<string | null>;
  shippingPrice: FormControl<string | null>;
  actualLoyaltyPrice: FormControl<string | null>;
  loyaltyPrice: FormControl<string | null>;
  productId: FormControl<number>;
  productMargin: FormControl<number>;
  quoteCost: FormControl<number>;
  linkedCompetitorPrices: FormArray<FormControl<string | null>>;
  unlinkedCompetitorPrices: FormArray<FormControl<string | null>>;
  suggestedSalePrice: FormControl<string | null>;
  suggestedLoyaltyPrice: FormControl<string | null>;
  suggestedSalePriceWithMargin: FormControl<number | null>;
  warningPriceText: FormControl<string | null>;
  saleMarginRuleText: FormControl<string | null>;
  loyaltyMarginRuleText: FormControl<string | null>;
  lockPrices: FormControl<boolean | null>;
  priceDiscountPercent: FormControl<number>;
  warningType: FormControl<EnumWarningProductType | null>;
}>;

@Component({
  selector: 'app-promotional-flyer-product-table',
  imports: [
    CommonModule,
    Spinner,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    FlexLayoutModule,
    MatIconModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    IconButton,
    MatTooltip,
    MatDivider,
    IconFilterButton,
  ],
  templateUrl: './promotional-flyer-product-table.html',

  styleUrls: ['../../../../global/styles/_tables.scss', './promotional-flyer-product-table.scss'],
})
export class PromotionalFlyerProductTable {
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChildren('salePriceInput')
  salePriceInputs!: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChildren('loyaltyPriceInput')
  loyaltyPriceInputs!: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChildren('shippingPriceInput')
  shippingPriceInputs!: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChildren('linkedCompetitorPriceInput')
  linkedCompetitorPriceInputs!: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChildren('unlikendCompetitorPriceInput')
  unlinkedCompetitorPriceInputs!: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  flyerInfo = input.required<IPromotionalFlyerView>();
  flyerId = input.required<number>();

  readonly ProductPriceType = ProductPriceType;
  readonly SupplierDeliveryTypeEnum = EnumSupplierDeliveryTypeEnum;
  private destroy$ = new Subject<void>();

  searchTerm = '';
  loading = inject(LoadingService).loading;
  sendingProductId?: number | null;
  unlinkedCompetitorsList: ICompetitorView[] = [];
  linkedCompetitorsList: ICompetitorView[] = [];
  suggestedPriceSettingsList: ISuggestedPriceSettingView[] = [];
  companyId!: number;
  userPermissions: IUserPermission | null = null;

  sortEvent!: Sort;

  dataSource = new MatTableDataSource<IPromotionalFlyerProductsView>([]);
  expandedElement: IPromotionalFlyerProductsView | null = null;
  columnsToDisplay = [
    'expand',
    'id',
    'name',
    'margin',
    'shipping_price',
    'quote_cost',
    'average_cost_quote',
    'current_sale_price',
    'sale_price',
    'current_loyalty_price',
    'loyalty_price',
    'fixed_price',
    'send',
  ];

  filterOptions: IFilterOptions<EnumFilterPromotionalFlyerProducts>[] =
    getPromotionalFlyerProductsFilterOptions();
  selectedFilterType = signal<null | EnumFilterPromotionalFlyerProducts>(null);

  paginatorDataSource: IDefaultPaginatorDataSource<IPromotionalFlyerProductsView> = {
    pageIndex: 0,
    pageSize: 10,
    records: {
      data: [],
      count: 0,
    },
  };

  form!: FormGroup;

  private search$ = new Subject<string>();

  constructor(
    private promotionalFlyerService: PromotionalFlyerService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private competitorService: CompetitorService,
    private competitorPriceFlyerProductService: CompetitorPriceFlyerProductService,
    private authService: AuthService,
    private suggestedPriceSettings: SuggestedPriceSettingService,
    private userPermissionService: UserPermissionService,
  ) {
    effect(() => {
      const info = this.flyerInfo();
      if (info && info.idIntegral) {
        this.loadData();
      }
    });
    effect(() => {
      const filterValue = this.selectedFilterType();
      this.reload(filterValue);
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.getUserPermissions();
    this.setupSearchListener();
    this.loadData();
  }

  private getUserPermissions() {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.userPermissionService.getPermissions(user.id).subscribe({
          next: (permissions) => {
            this.userPermissions = permissions;
          },
        });
      },
      error: (err) => {
        this.notificationService.showError(`Erro ao buscar usuário logado: ${err.message || err}`);
      },
    });
  }

  private setupSearchListener(): void {
    this.search$
      .pipe(debounceTime(600), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.searchTerm = value;
        this.paginatorDataSource.pageIndex = 0;
        if (this.companyId) {
          this.reload(this.selectedFilterType());
        }
      });
  }

  private loadData(): void {
    this.authService
      .getCompanyIdFromLoggedUser()
      .pipe(
        tap((companyId) => (this.companyId = companyId)),
        switchMap((companyId) => this.suggestedPriceSettings.loadSuggestedPriceSettings(companyId)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (suggestedPriceSettings) => {
          this.suggestedPriceSettingsList = suggestedPriceSettings;
          this.reload();
        },
        error: (err) => {
          console.error(err);
          this.notificationService.showError(
            `Erro ao carregar configurações: ${err.message || err}`,
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.authService.getCompanyIdFromLoggedUser().subscribe({
      next: (companyId) => {
        this.companyId = companyId;
      },
      error: (err) => {
        this.notificationService.showError(`Erro ao carregar companyId: ${err.message || err}`);
      },
    });
  }

  loadProductsFromPromotionalFlyer(
    flyerId: number,
    idIntegral: number,
    paginatorDataSource: IDefaultPaginatorDataSource<IPromotionalFlyerProductsView>,
    search?: string,
    selectedFilterType?: EnumFilterPromotionalFlyerProducts,
  ): void {
    this.promotionalFlyerService
      .loadProducts(flyerId, idIntegral, paginatorDataSource, search, selectedFilterType)
      .subscribe({
        next: (response) => {
          this.paginatorDataSource.records = response;
          this.dataSource.data = response.data;

          this.buildForm(this.dataSource.data);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.notificationService.showError(
            `Erro ao buscar produtos do encarte ${flyerId}: ${err.message || err}`,
          );
          this.cdr.detectChanges();
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.paginatorDataSource.pageSize = event.pageSize;
    this.paginatorDataSource.pageIndex = event.pageIndex;
    this.expandedElement = null;
    this.reload();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }

  reload(filterType: EnumFilterPromotionalFlyerProducts | null = this.selectedFilterType()): void {
    const currentBrancheId = this.flyerInfo().branche.id;
    this.competitorService
      .loadCompetitors({
        pageIndex: 0,
        pageSize: 999,
        records: { data: [], count: 0 },
      })
      .subscribe({
        next: (competitors) => {
          this.linkedCompetitorsList = competitors.data.filter((c) =>
            c.competitorBranches.some((cb) => cb.brancheId === currentBrancheId),
          );

          this.unlinkedCompetitorsList = competitors.data.filter(
            (c) => !c.competitorBranches.some((cb) => cb.brancheId === currentBrancheId),
          );

          this.loadProductsFromPromotionalFlyer(
            this.flyerId(),
            this.flyerInfo().idIntegral,
            this.paginatorDataSource,
            this.searchTerm,
            filterType ?? undefined,
          );
        },
        error: (err) => {
          this.notificationService.showError(`Erro ao buscar concorrentes: ${err.message || err}`);
        },
      });
  }

  get rows(): FormArray<FlyerRowForm> {
    return this.form.get('rows') as FormArray<FlyerRowForm>;
  }

  private buildForm(data: IPromotionalFlyerProductsView[]): void {
    const rowsArray = this.fb.array<FlyerRowForm>(
      data.map((item) => {
        const linkedCompetitorControls = this.linkedCompetitorsList.map((competitor) => {
          const priceEntry = item.competitorPrices?.find(
            (cp: any) => cp.competitor?.id === competitor.id,
          );

          const formattedPrice = priceEntry?.price
            ? priceEntry.price.toFixed(2).replace('.', ',')
            : '0,00';

          return this.fb.control<string | null>(formattedPrice);
        });

        const unlinkedCompetitorControls = this.unlinkedCompetitorsList.map((competitor) => {
          const priceEntry = item.competitorPrices?.find(
            (cp: any) => cp.competitor?.id === competitor.id,
          );

          const formattedPrice = priceEntry?.price
            ? priceEntry.price.toFixed(2).replace('.', ',')
            : '0,00';

          return this.fb.control<string | null>(formattedPrice);
        });

        const rowForm = this.fb.group({
          productId: this.fb.control<number>(item.product.id, { nonNullable: true }),
          actualSalePrice: this.fb.control<string | null>(
            item.currentSalePrice != null
              ? item.currentSalePrice.toFixed(2).replace('.', ',')
              : '0,00',
          ),
          salePrice: this.fb.control<string | null>(
            item.salePrice != null ? item.salePrice.toFixed(2).replace('.', ',') : '0,00',
          ),
          shippingPrice: this.fb.control<string | null>(
            item.shippingPrice != null ? item.shippingPrice.toFixed(2).replace('.', ',') : '0,00',
          ),
          loyaltyPrice: this.fb.control<string | null>(
            item.loyaltyPrice != null ? item.loyaltyPrice.toFixed(2).replace('.', ',') : '0,00',
          ),
          actualLoyaltyPrice: this.fb.control<string | null>(
            item.currentLoyaltyPrice != null
              ? item.currentLoyaltyPrice.toFixed(2).replace('.', ',')
              : '0,00',
          ),
          linkedCompetitorPrices: this.fb.array(linkedCompetitorControls),
          unlinkedCompetitorPrices: this.fb.array(unlinkedCompetitorControls),
          productMargin: this.fb.control<number>(item.product?.margin ?? 0),
          quoteCost: this.fb.control<number>(item.quoteCost ?? 0),
          suggestedSalePrice: this.fb.control<string | null>(null),
          suggestedSalePriceWithMargin: this.fb.control<string | null>(null),
          suggestedLoyaltyPrice: this.fb.control<string | null>('0,00'),
          warningPriceText: this.fb.control<string | null>(null),
          saleMarginRuleText: this.fb.control<string | null>(null),
          loyaltyMarginRuleText: this.fb.control<string | null>(null),
          lockPrices: this.fb.control<boolean | null>(item.lockPrice === true),
          priceDiscountPercent: this.fb.control<number>(item.priceDiscountPercent ?? 0),
          warningType: this.fb.control<EnumWarningProductType | null>(item?.warningType || null),
        }) as FlyerRowForm;

        this.calculateSuggestedPrice(rowForm);
        this.setObservables(rowForm);

        return rowForm;
      }),
    );

    this.form.setControl('rows', rowsArray);
  }

  onEnterNext(
    queryList: QueryList<ElementRef<HTMLInputElement>>,
    currentInput: HTMLInputElement,
  ): void {
    const inputs = queryList.toArray();
    const currentIndex = inputs.findIndex((input) => input.nativeElement === currentInput);

    if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
      const nextField = inputs[currentIndex + 1].nativeElement;
      nextField.focus();
      setTimeout(() => nextField.select());
    } else if (this.paginator?.hasNextPage()) {
      this.paginator.nextPage();
    }
  }

  onEnterInRow(
    lineIndex: number,
    colIndex: number,
    inputsArray: ElementRef<HTMLInputElement>[],
    elementList: any[],
  ): void {
    const totalCols = elementList.length;
    const globalIndex = lineIndex * totalCols + colIndex;

    inputsArray[globalIndex]?.nativeElement.blur();

    const isLastInRow = colIndex === totalCols - 1;

    if (!isLastInRow) {
      const nextGlobalIndex = globalIndex + 1;
      setTimeout(() => inputsArray[nextGlobalIndex]?.nativeElement.focus());
    } else {
      const nextRowIndex = lineIndex + 1;
      const nextRowData = this.dataSource.data[nextRowIndex];

      if (nextRowData) {
        this.expandedElement = nextRowData;

        setTimeout(() => {
          const nextRowFirstCompIndex = nextRowIndex * totalCols;
          const nextInput = inputsArray[nextRowFirstCompIndex];

          if (nextInput) {
            nextInput.nativeElement.focus();
            nextInput.nativeElement.select();

            nextInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      } else {
        if (this.paginator?.hasNextPage()) {
          this.paginator.nextPage();
          this.expandedElement = null;
        } else {
          this.expandedElement = null;
        }
      }
    }
  }

  async onPriceBlur(
    initialPrice: string,
    productId: number,
    control: FormControl<string | null>,
    columnName: string,
    competitorId?: number,
  ): Promise<void> {
    let value = control.value;

    if (!value) {
      control.setValue('0,00', { emitEvent: false });
      value = '0,00';
    }

    const numericPrice = transformToNumberValue(value);
    const numericInitialPrice = transformToNumberValue(initialPrice);

    if (numericPrice === numericInitialPrice) return;

    if (!isNaN(numericPrice)) {
      const formatted = numericPrice.toFixed(2).replace('.', ',');
      control.setValue(formatted, { emitEvent: false });

      if (columnName.toLocaleLowerCase() !== 'competitor_price') {
        this.promotionalFlyerService
          .updateProductPrice(this.flyerId(), productId, numericPrice, columnName)
          .subscribe({
            error: (err) => {
              this.notificationService.showError(
                `Erro ao atualizar preço. Item: ${productId} | Erro: ${err.message || err}`,
              );
            },
          });
      } else {
        if (!competitorId) return;

        if (numericPrice > 0) {
          this.competitorPriceFlyerProductService
            .upsertCompetitorPriceFlyerProduct({
              productId: productId,
              price: numericPrice,
              competitorId: competitorId,
              companyId: this.companyId,
              integralFlyerId: this.flyerInfo().idIntegral,
            })
            .subscribe({
              error: (err) => {
                this.notificationService.showError(
                  `Erro ao atualizar preço do concorrente. Item: ${productId} | Erro: ${
                    err.message || err
                  }`,
                );
              },
            });
        } else {
          this.competitorPriceFlyerProductService
            .deleteCompetitorPriceFlyerProduct({
              productId: productId,
              competitorId: competitorId,
              companyId: this.companyId,
              integralFlyerId: this.flyerInfo().idIntegral,
            })
            .subscribe({
              error: (err) => {
                this.notificationService.showError(
                  `Erro ao deletar preço do concorrente. Item: ${productId} | Erro: ${
                    err.message || err
                  }`,
                );
              },
            });
        }
      }
    }
  }

  onFocus(input: HTMLInputElement) {
    if (input) {
      input.select();
    }
  }

  sendPrices(productId: number) {
    this.sendingProductId = productId;

    this.promotionalFlyerService.sendPricesToErp(this.flyerId(), productId).subscribe({
      error: (err) => {
        this.notificationService.showError(
          `Erro ao marcar preço para ser enviado ao ERP. Produto: ${productId} | Erro: ${err.message || err}`,
        );
      },
      complete: () => {
        this.sendingProductId = null;
        this.cdr.detectChanges();
      },
    });
  }

  lockOrUnlockPrices(productId: number, lock: boolean, index: number) {
    this.promotionalFlyerService.lockOrUnlockPrices(this.flyerId(), productId, lock).subscribe({
      next: () => {
        const typeOperation = lock ? 'fixado' : 'desafixado';
        this.notificationService.showSuccess(
          `Preço ${typeOperation} corretamente para o produto ${productId}`,
        );
        this.rows.at(index).controls.lockPrices.setValue(lock);
      },
      error: (err) => {
        this.notificationService.showError(
          `Erro ao fixar preços no produto ${productId}:  ${err.message || err}.`,
        );
      },
    });
  }

  isPriceInvalid(index: number): boolean {
    const { salePrice, loyaltyPrice } = this.rows.at(index).getRawValue();

    const isValid = (val: any) => {
      if (!val) return false;
      const cleanValue = String(val).replace('R$ ', '').replace(/\./g, '').replace(',', '.');
      const numeric = parseFloat(cleanValue);
      return !isNaN(numeric) && numeric > 0;
    };

    return !isValid(salePrice) && !isValid(loyaltyPrice);
  }

  toggleRow(row: IPromotionalFlyerProductsView): void {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  calculateSuggestedPrice(flyerRow: FlyerRowForm) {
    const {
      shippingPrice,
      productMargin,
      linkedCompetitorPrices,
      quoteCost,
      suggestedSalePrice,
      suggestedLoyaltyPrice,
      actualLoyaltyPrice,
      suggestedSalePriceWithMargin,
      warningPriceText,
      saleMarginRuleText,
      loyaltyMarginRuleText,
      productId,
      priceDiscountPercent,
      warningType,
    } = flyerRow.controls;
    suggestedSalePrice.setValue(null, { emitEvent: false });
    suggestedLoyaltyPrice.setValue(null, { emitEvent: false });
    warningPriceText.setValue(null);

    const productMarginValue = transformToNumberValue(productMargin.value ?? 0);
    if (!productMarginValue) return;

    const finalCost =
      transformToNumberValue(shippingPrice.value ?? 0) +
      transformToNumberValue(quoteCost.value ?? 0);

    const suggestedPrice = finalCost * (1 + productMarginValue / 100);
    suggestedSalePriceWithMargin.setValue(suggestedPrice, { emitEvent: false });

    const competitorPriceValues = linkedCompetitorPrices.value.map((value) => {
      return transformToNumberValue(value ?? '0');
    });
    const pricesOnly = competitorPriceValues.filter((price) => price > 0);
    const lowestCompetitorPrice = pricesOnly.length > 0 ? Math.min(...pricesOnly) : 0;

    if (!lowestCompetitorPrice) {
      warningPriceText.setValue('Não informado preço dos concorrentes.');
      return;
    }

    if (finalCost >= lowestCompetitorPrice) {
      warningPriceText.setValue('Preço do concorrente menor ou igual ao custo.');
      if (warningType.value !== EnumWarningProductType.CompetitorPrice) {
        this.promotionalFlyerService
          .updateWarningType(
            this.flyerId(),
            productId.value,
            EnumWarningProductType.CompetitorPrice,
          )
          .subscribe();
      }
      return;
    }

    const competitorMargin = (1 - finalCost / lowestCompetitorPrice) * 100;
    const marginRule = this.suggestedPriceSettingsList.find(
      (marginSetting) =>
        competitorMargin >= marginSetting.marginMin && competitorMargin <= marginSetting.marginMax,
    );

    const loyaltyPriceValue = transformToNumberValue(actualLoyaltyPrice.value ?? 0);

    if (competitorMargin < 7) {
      warningPriceText.setValue('Margem do concorrente menor que 7%.');

      if (loyaltyPriceValue) {
        loyaltyMarginRuleText.setValue(
          `${productMarginValue}% em relação ao custo final(Pr.Cotação + Frete).`,
        );
      } else {
        saleMarginRuleText.setValue(
          `${productMarginValue}% em relação ao custo final(Pr.Cotação + Frete).`,
        );
      }

      if (warningType.value !== EnumWarningProductType.CompetitorMargin) {
        this.promotionalFlyerService
          .updateWarningType(
            this.flyerId(),
            productId.value,
            EnumWarningProductType.CompetitorMargin,
          )
          .subscribe();
      }
    } else {
      this.promotionalFlyerService
        .updateWarningType(this.flyerId(), productId.value, undefined)
        .subscribe();
    }

    let suggestedPriceAfterDiscountPercent = suggestedPrice;

    if (lowestCompetitorPrice < suggestedPrice && marginRule) {
      suggestedPriceAfterDiscountPercent =
        lowestCompetitorPrice * (1 - marginRule.discountPercent / 100);
    }

    if (loyaltyPriceValue) {
      suggestedSalePrice.setValue(roundToTwo(suggestedPriceAfterDiscountPercent * 1.15), {
        emitEvent: false,
      });
      suggestedLoyaltyPrice.setValue(roundToTwo(suggestedPriceAfterDiscountPercent), {
        emitEvent: false,
      });

      if (marginRule) {
        loyaltyMarginRuleText.setValue(
          `-${marginRule.discountPercent}% em relação ao menor preço dos concorrentes.`,
        );
      }

      saleMarginRuleText.setValue(`+15% em relação ao preço fidelidade sugerido.`);
    } else {
      suggestedSalePrice.setValue(roundToTwo(suggestedPriceAfterDiscountPercent), {
        emitEvent: false,
      });

      if (marginRule) {
        saleMarginRuleText.setValue(
          `-${marginRule.discountPercent}% em relação ao menor preço dos concorrentes.`,
        );
      }
    }

    const actualDiscountPercent = priceDiscountPercent?.value || 0;
    if ((marginRule?.discountPercent || 0) !== actualDiscountPercent) {
      this.promotionalFlyerService
        .updatePriceDiscountPercent(
          this.flyerId(),
          productId.value,
          marginRule?.discountPercent || 0,
        )
        .subscribe();
    }

    priceDiscountPercent.setValue(marginRule?.discountPercent || 0);
  }

  private setObservables(rowForm: FlyerRowForm) {
    merge(
      rowForm.controls.linkedCompetitorPrices.valueChanges,
      rowForm.controls.shippingPrice.valueChanges,
      rowForm.controls.productMargin.valueChanges,
      rowForm.controls.quoteCost.valueChanges,
    )
      .pipe(debounceTime(600), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.calculateSuggestedPrice(rowForm);
      });
  }

  getFinalCost(index: number, quoteCost: number): number {
    const shipping = transformToNumberValue(this.rows.at(index).get('shippingPrice')?.value || 0);
    return quoteCost + shipping;
  }

  getShippingPrice(index: number) {
    return transformToNumberValue(this.rows.at(index).get('shippingPrice')?.value || 0);
  }

  isLowestPrice(rowIndex: number, currentPrice: string | null): boolean {
    const row = this.rows.at(rowIndex);
    if (!row || !currentPrice) return false;

    const priceValues = row.controls.linkedCompetitorPrices.value
      .map((v) => transformToNumberValue(v ?? '0'))
      .filter((v) => v > 0);

    if (priceValues.length === 0) return false;

    const minPrice = Math.min(...priceValues);
    const currentNumeric = transformToNumberValue(currentPrice);

    return currentNumeric === minPrice && currentNumeric > 0;
  }

  competitorMargin(rowIndex: number, competitorPrice: string | null) {
    if (!competitorPrice) return '0,00%';

    const row = this.rows.at(rowIndex);
    const quoteCost = row.controls.quoteCost.value || 0;
    const shippingPrice = transformToNumberValue(row?.controls?.shippingPrice?.value || 0);

    const finalCost = quoteCost + shippingPrice;
    const competitorPriceValue = transformToNumberValue(competitorPrice);

    if (competitorPriceValue === 0 || isNaN(competitorPriceValue)) {
      return '0,00%';
    }

    const margin = (1 - finalCost / competitorPriceValue) * 100;
    return `${margin.toFixed(2).replace('.', ',')}%`;
  }

  marginRuleText(rowIndex: number) {
    const row = this.rows.at(rowIndex);
    const saleMarginRuleText = row.controls.saleMarginRuleText.value;
    const loyaltyMarginRuleText = row.controls.loyaltyMarginRuleText.value;
    return { saleMarginRuleText, loyaltyMarginRuleText };
  }
}
