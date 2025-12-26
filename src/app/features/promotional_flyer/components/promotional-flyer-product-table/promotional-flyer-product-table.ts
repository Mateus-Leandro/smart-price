import {
  ChangeDetectorRef,
  Component,
  ElementRef,
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

import { PromotionalFlyerService } from '../../services/promotional-flyer.service';
import { IPromotionalFlyerProducts } from '../../../../shared/interfaces/promotional-flyer.interface';
import { IDefaultPaginatorDataSource } from 'src/app/shared/interfaces/query-interface';

import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';

type FlyerRowForm = FormGroup<{
  salePrice: FormControl<string | null>;
  productId: FormControl<number>;
}>;

@Component({
  selector: 'app-promotional-flyer-product-table',
  imports: [
    Spinner,
    IconButton,
    MatTableModule,
    MatSortModule,
    MatPaginator,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    FlexLayoutModule,
    MatIconModule,
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
  templateUrl: './promotional-flyer-product-table.html',
  styleUrl: './promotional-flyer-product-table.scss',
})
export class PromotionalFlyerProductTable {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren('priceInput')
  priceInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchTerm = '';
  loading = false;
  flyerId = 0;

  sortEvent!: Sort;

  dataSource = new MatTableDataSource<IPromotionalFlyerProducts>([]);

  paginatorDataSource: IDefaultPaginatorDataSource<IPromotionalFlyerProducts> = {
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

  async loadProductsFromPromotionalFlyer(
    flyerId: number,
    paginatorDataSource: IDefaultPaginatorDataSource<IPromotionalFlyerProducts>,
    search?: string,
  ): Promise<void> {
    this.loading = true;

    try {
      this.paginatorDataSource.records = await this.promotionalFlyerService.loadProducts(
        flyerId,
        paginatorDataSource,
        search,
      );

      this.dataSource.data = this.paginatorDataSource.records.data;
      this.buildForm(this.dataSource.data);
    } catch (err) {
      console.error(`Erro ao buscar produtos do encarte ${flyerId}`, err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  onPageChange(event: PageEvent): void {
    this.paginatorDataSource.pageSize = event.pageSize;
    this.paginatorDataSource.pageIndex = event.pageIndex;
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

  private buildForm(data: IPromotionalFlyerProducts[]): void {
    const rowsArray = this.fb.array<FlyerRowForm>(
      data.map((item) =>
        this.fb.group({
          salePrice: this.fb.control<string | null>(
            item.salePrice != null ? item.salePrice.toFixed(2).replace('.', ',') : null,
          ),
          productId: this.fb.control<number>(item.id, { nonNullable: true }),
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
        next.nativeElement.select();
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
      try {
        await this.promotionalFlyerService.updateSalePrice(this.flyerId, productId, numericPrice);
      } catch (error) {
        console.error('Falha ao atualizar preço de venda no banco');
      }
    }
  }
}
