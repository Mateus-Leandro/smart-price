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
import { IPromotionalFlyerProductsView } from '../../models/flyer-view.model';
import { LoadingService } from 'src/app/core/services/loading.service';

type FlyerRowForm = FormGroup<{
  salePrice: FormControl<string | null>;
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
  ],
  templateUrl: './promotional-flyer-product-table.html',
  styleUrl: '../../../../global/styles/_tables.scss',
})
export class PromotionalFlyerProductTable {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren('priceInput')
  priceInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
    'current_loyalty_price',
    'sale_price',
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
        console.error(`Erro ao buscar produtos do encarte ${flyerId}`, err);
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
          salePrice: this.fb.control<string | null>(
            item.salePrice != null ? item.salePrice.toFixed(2).replace('.', ',') : null,
          ),
          productId: this.fb.control<number>(item.product.id, { nonNullable: true }),
        }),
      ),
    );

    this.form.setControl('rows', rowsArray);
  }

  onEnter(index: number): void {
    const inputs = this.priceInputs.toArray();
    const current = inputs[index];
    const next = inputs[index + 1];

    if (current) {
      current.nativeElement.blur();
    }

    if (next) {
      setTimeout(() => {
        next.nativeElement.focus();
      });
    } else if (this.paginator && this.paginator.hasNextPage()) {
      this.paginator.nextPage();
      this.focusFirstInputAfterLoad();
    }
  }

  private focusFirstInputAfterLoad(): void {
    const interval = setInterval(() => {
      if (!this.loading) {
        clearInterval(interval);
        setTimeout(() => {
          if (this.priceInputs.first) {
            this.priceInputs.first.nativeElement.focus();
            this.priceInputs.first.nativeElement.select();
          }
        }, 200);
      }
    }, 50);
    setTimeout(() => clearInterval(interval), 5000);
  }

  async onPriceBlur(index: number): Promise<void> {
    const control = this.rows.at(index).controls;
    let value = control.salePrice.value;
    const productId = control.productId.value;

    if (!value) {
      control.salePrice.setValue('0,00', { emitEvent: false });
      return;
    }

    let cleanValue = value.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    const numericPrice = parseFloat(cleanValue);

    if (!isNaN(numericPrice)) {
      const formatted = numericPrice.toFixed(2).replace('.', ',');
      control.salePrice.setValue(formatted, { emitEvent: false });

      this.promotionalFlyerService
        .updateSalePrice(this.flyerId, productId, numericPrice)
        .subscribe({
          error: (error) => console.error('Falha ao atualizar preço:', error),
        });
    }
  }

  onFocus(index: number) {
    const inputs = this.priceInputs.toArray();
    const current = inputs[index];
    if (current) {
      current.nativeElement.select();
    }
  }

  sendPrices(productId: number) {
    this.sendingProductId = productId;

    this.promotionalFlyerService.sendPricesToErp(this.flyerId, productId).subscribe({
      error: (error) => {
        console.error('Erro ao enviar preço:', error);
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
