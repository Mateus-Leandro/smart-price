import { Component, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { IconButton } from "../../../../shared/components/icon-button/icon-button";

@Component({
  selector: 'app-price-records-list-table',
  imports: [MatTableModule, MatSortModule, MatIconModule, IconButton],
  templateUrl: './price-records-list-table.html',
  styleUrl: './price-records-list-table.scss',
})
export class PriceRecordsListTable {
  @ViewChild(MatSort) sort!: MatSort;
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
}
