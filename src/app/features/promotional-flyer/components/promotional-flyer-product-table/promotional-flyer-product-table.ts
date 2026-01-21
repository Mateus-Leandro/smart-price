import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  QueryList,
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
import { Subject } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { PromotionalFlyerService } from '../../services/promotional-flyer.service';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MatTooltip } from '@angular/material/tooltip';
import { ProductPriceType } from '../../../../core/enums/product.enum';
import { IPromotionalFlyerProductsView } from 'src/app/core/models/promotional-flyer.model';

type FlyerRowForm = FormGroup<{
  salePrice: FormControl<string | null>;
  loyaltyPrice: FormControl<string | null>;
  productId: FormControl<number>;
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
  ],
  templateUrl: './promotional-flyer-product-table.html',
  styleUrl: '../../../../global/styles/_tables.scss',
})
export class PromotionalFlyerProductTable {
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChildren('salePriceInput')
  salePriceInputs!: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChildren('loyaltyPriceInput')
  loyaltyPriceInputs!: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly ProductPriceType = ProductPriceType;

  searchTerm = '';
  loading = inject(LoadingService).loading;
  flyerId = 0;
  sendingProductId?: number | null;

  sortEvent!: Sort;

  dataSource = new MatTableDataSource<IPromotionalFlyerProductsView>([]);
  expandedElement: IPromotionalFlyerProductsView | null = null;
  columnsToDisplay = [
    'expand',
    'id',
    'name',
    'quote_cost',
    'current_cost_price',
    'current_sale_price',
    'sale_price',
    'current_loyalty_price',
    'loyalty_price',
    'erp_import_date',
    'send',
  ];

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
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.flyerId = Number(this.route.snapshot.paramMap.get('id'));
    this.reload();

    this.search$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm = value;
      this.paginatorDataSource.pageIndex = 0;
      this.reload();
    });

    this.form = this.fb.group({
      rows: this.fb.array([]),
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  loadProductsFromPromotionalFlyer(
    flyerId: number,
    paginatorDataSource: IDefaultPaginatorDataSource<IPromotionalFlyerProductsView>,
    search?: string,
  ): void {
    this.promotionalFlyerService.loadProducts(flyerId, paginatorDataSource, search).subscribe({
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

  private reload(): void {
    this.loadProductsFromPromotionalFlyer(this.flyerId, this.paginatorDataSource, this.searchTerm);
  }

  get rows(): FormArray<FlyerRowForm> {
    return this.form.get('rows') as FormArray<FlyerRowForm>;
  }

  private buildForm(data: IPromotionalFlyerProductsView[]): void {
    const rowsArray = this.fb.array<FlyerRowForm>(
      data.map((item) =>
        this.fb.group({
          productId: this.fb.control<number>(item.product.id, { nonNullable: true }),
          salePrice: this.fb.control<string | null>(
            item.salePrice != null ? item.salePrice.toFixed(2).replace('.', ',') : '0,00',
          ),
          loyaltyPrice: this.fb.control<string | null>(
            item.loyaltyPrice != null ? item.loyaltyPrice.toFixed(2).replace('.', ',') : '0,00',
          ),
        }),
      ),
    );

    this.form.setControl('rows', rowsArray);
  }

  onEnter(index: number, type: ProductPriceType): void {
    const loyaltyPriceInputs = this.loyaltyPriceInputs.toArray();
    const salePriceInputs = this.salePriceInputs.toArray();

    let current;
    let next;

    if (type === ProductPriceType.SalePrice) {
      current = salePriceInputs[index];
      next = loyaltyPriceInputs[index];
    } else {
      current = loyaltyPriceInputs[index];
      next = salePriceInputs[index + 1];
    }

    if (current) {
      current.nativeElement.blur();
    }

    if (next) {
      setTimeout(() => next.nativeElement.focus());
    } else if (this.paginator) {
      this.paginator.nextPage();
      this.focusFirstInputAfterLoad(ProductPriceType.SalePrice);
    }
  }

  private focusFirstInputAfterLoad(type: ProductPriceType): void {
    const interval = setInterval(() => {
      if (!this.loading()) {
        clearInterval(interval);

        setTimeout(() => {
          const list =
            type === ProductPriceType.SalePrice ? this.salePriceInputs : this.loyaltyPriceInputs;

          if (list?.first) {
            list.first.nativeElement.focus();
            list.first.nativeElement.select();
          }
        }, 100);
      }
    }, 50);

    setTimeout(() => clearInterval(interval), 5000);
  }

  async onPriceBlur(
    initialSalePrice: string,
    index: number,
    productPriceType: ProductPriceType,
    productId: number,
  ): Promise<void> {
    const control =
      productPriceType == ProductPriceType.SalePrice
        ? this.rows.at(index).controls.salePrice
        : this.rows.at(index).controls.loyaltyPrice;

    const value = control.value;

    if (!value) {
      control.setValue('0,00', { emitEvent: false });
      return;
    }

    let cleanPriceValue = value.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    let cleanInitialPriceValue = initialSalePrice
      .replace('R$ ', '')
      .replace(/\./g, '')
      .replace(',', '.');

    const numericPrice = parseFloat(cleanPriceValue);
    const numericInitialPrice = parseFloat(cleanInitialPriceValue);

    if (numericPrice === numericInitialPrice) return;

    if (!isNaN(numericPrice)) {
      const formatted = numericPrice.toFixed(2).replace('.', ',');
      control.setValue(formatted, { emitEvent: false });

      this.promotionalFlyerService
        .updateProductPrice(this.flyerId, productId, numericPrice, productPriceType)
        .subscribe({
          error: (err) => {
            this.notificationService.showError(
              `Erro ao atualizar preço. Item: ${productId} | Erro: ${err.message || err}`,
            );
          },
        });
    }
  }

  onFocus(index: number, type: ProductPriceType) {
    const inputs =
      type === ProductPriceType.SalePrice
        ? this.salePriceInputs.toArray()
        : this.loyaltyPriceInputs.toArray();

    const current = inputs[index];
    if (current) {
      current.nativeElement.select();
    }
  }

  sendPrices(productId: number) {
    this.sendingProductId = productId;

    this.promotionalFlyerService.sendPricesToErp(this.flyerId, productId).subscribe({
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

  isPriceInvalid(index: number): boolean {
    const value = this.rows.at(index).controls.salePrice.value;

    if (!value) return true;

    const cleanValue = value.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    const numericPrice = parseFloat(cleanValue);

    return isNaN(numericPrice) || numericPrice <= 0;
  }

  toggleRow(row: IPromotionalFlyerProductsView): void {
    this.expandedElement = this.expandedElement === row ? null : row;
  }
}
