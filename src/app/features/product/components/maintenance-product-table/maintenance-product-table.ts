import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PageEvent, MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { IProductView } from 'src/app/features/product/models/product.model';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { ProductService } from '../../services/product.service';
import { TableColumn } from 'src/app/core/models/table-app.model';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatTable,
  MatHeaderCellDef,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { LoadingService } from 'src/app/core/services/loading.service';
import { CompanyBrancheService } from 'src/app/features/company-branche/services/company-branche.service';
import { ICompanyBrancheView } from 'src/app/features/company-branche/models/company-branch-view.model';
import { NgxMaskDirective } from 'ngx-mask';

type BranchGroup = FormGroup<{
  brancheId: FormControl<number>;
  margin: FormControl<number>;
}>;

type ProductMarginBrancheRowForm = FormGroup<{
  productId: FormControl<number>;
  marginBranches: FormArray<BranchGroup>;
}>;

@Component({
  selector: 'app-product-maintenance-product-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    Spinner,
    MatFormField,
    MatLabel,
    MatIcon,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTable,
    MatHeaderCellDef,
    MatPaginator,
    MatTableModule,
    NgxMaskDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './maintenance-product-table.html',
  styleUrl: '../../../../global/styles/_tables.scss',
})
export class MaintenanceProductTable implements OnInit {
  loading = inject(LoadingService).loading;
  searchTerm = '';
  dataSource = new MatTableDataSource<IProductView>([]);
  expandedElement: IProductView | null = null;
  columnsToDisplay = ['expand', 'id', 'name', 'created_at', 'updated_at'];
  companyBrancheList: ICompanyBrancheView[] = [];
  marginFormGroup!: FormGroup;

  paginatorDataSource: IDefaultPaginatorDataSource<IProductView> = {
    pageIndex: 0,
    pageSize: 10,
    records: { data: [], count: 0 },
  };

  companyBranchePaginatorDataSource: IDefaultPaginatorDataSource<ICompanyBrancheView> = {
    pageIndex: 0,
    pageSize: 99,
    records: { data: [], count: 0 },
  };

  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nome' },
    { key: 'createdAt', label: 'Criado em', type: 'date' },
    { key: 'updatedAt', label: 'Alterado em', type: 'date' },
  ];

  private search$ = new Subject<string>();

  constructor(
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private companyBrancheService: CompanyBrancheService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.reload();
    this.companyBrancheService
      .loadCompanyBranches(this.companyBranchePaginatorDataSource)
      .subscribe({
        next: (branches) => {
          this.companyBrancheList = branches.data;
        },
        error: (err) => {
          console.error('Erro ao carregar lojas', err);
          this.cdr.detectChanges();
        },
      });

    this.search$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm = value;
      this.paginatorDataSource.pageIndex = 0;
      this.reload();
    });

    this.marginFormGroup = this.fb.group({
      rows: this.fb.array([]),
    });
  }

  loadProducts(paginator: IDefaultPaginatorDataSource<IProductView>, search?: string) {
    this.productService.loadProducts(paginator, search).subscribe({
      next: (response) => {
        this.paginatorDataSource.records = response;
        this.dataSource.data = response.data;
        this.buildMarginForm(response.data);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar produtos', err);
        this.cdr.detectChanges();
      },
    });
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
    this.loadProducts(this.paginatorDataSource, this.searchTerm);
  }

  toggleRow(row: IProductView): void {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  getMarginValue(product: IProductView, brancheId: number): number | string {
    const branchMargin = product.marginBranches?.find((m) => m.brancheId === brancheId);
    return branchMargin ? branchMargin.margin : '';
  }

  private buildMarginForm(products: IProductView[]): void {
    const rowsArray = this.fb.array<ProductMarginBrancheRowForm>(
      products.map((product) => {
        const branchArray = this.fb.array<BranchGroup>(
          this.companyBrancheList.map((branch) => {
            const existingMargin =
              product.marginBranches?.find((m) => m.brancheId === branch.id)?.margin || 0;

            return this.fb.group({
              brancheId: this.fb.control(branch.id, { nonNullable: true }),
              margin: this.fb.control(existingMargin, {
                nonNullable: true,
                validators: [Validators.max(100)],
              }),
            }) as BranchGroup;
          }),
        );

        return this.fb.group({
          productId: this.fb.control(product.id, { nonNullable: true }),
          marginBranches: branchArray,
        }) as ProductMarginBrancheRowForm;
      }),
    );

    this.marginFormGroup.setControl('rows', rowsArray);
  }

  getBrancheArray(productId: number): FormArray<BranchGroup> | null {
    const row = this.rows.controls.find((c) => c.get('productId')?.value === productId);
    return row ? (row.get('marginBranches') as FormArray<BranchGroup>) : null;
  }

  getMarginControl(productId: number, branchId: number): FormControl<number> {
    const brancheArray = this.getBrancheArray(productId);
    const brancheNumber = brancheArray?.controls.find(
      (c) => c.get('brancheId')?.value === branchId,
    );
    return brancheNumber?.get('margin') as FormControl<number>;
  }

  get rows(): FormArray<ProductMarginBrancheRowForm> {
    return this.marginFormGroup.get('rows') as FormArray<ProductMarginBrancheRowForm>;
  }
}
