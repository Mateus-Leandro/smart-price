import { Component, inject, model, signal, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Button } from '../../../../shared/components/button/button';
import { ToolBar } from '../../../../core/layout/tool-bar/tool-bar';
import { PricingRecordsListTable } from '../../components/pricing-records-list-table/pricing-records-list-table';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  PrincingRecordsForm,
  PrincingRecordsFormData,
} from '../../components/princing-records-form/princing-records-form';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Component({
  selector: 'app-price-records-list',
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    Button,
    ToolBar,
    PricingRecordsListTable,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './pricing-records-list.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './pricing-records-list.scss',
})
export class PricingRecordsList {
  @ViewChild(MatSort) sort!: MatSort;
  private readonly dialog = inject(MatDialog);
  formData = signal<PrincingRecordsFormData>({ name: '', creationDate: '' });

  constructor(private authService: AuthService) {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      if (property === 'data') {
        const [dia, mes, ano] = item.data.split('/');
        return new Date(`${ano}-${mes}-${dia}`).getTime();
      }

      if (property === 'produtos') {
        return Number(item.produtos.replace(/\D/g, ''));
      }

      return item[property];
    };
  }

  dataSource = new MatTableDataSource([
    {
      nome: 'Encarte Semanal - 04/11/2025',
      data: '03/11/2025',
      status: 'Concluído',
      produtos: '45 produtos',
      acoes: '',
    },
    {
      nome: 'Promoção Quinzenal - 28/10/2025',
      data: '27/10/2025',
      status: 'Concluído',
      produtos: '38 produtos',
      acoes: '',
    },
    {
      nome: 'Encarte Mensal - Novembro',
      data: '31/10/2025',
      status: 'Em andamento',
      produtos: '12 produtos',
      acoes: '',
    },
  ]);

  openDialog(): void {
    const dialogRef = this.dialog.open(PrincingRecordsForm, {
      data: {
        name: this.formData().name,
        creationDate: this.formData().creationDate,
      },
    });

    dialogRef.afterClosed().subscribe((result: PrincingRecordsFormData | undefined) => {
      if (result) {
        this.formData.set(result);
      }
    });
  }
}
