import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';


@Component({
  selector: 'app-lista-precificacao',
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
  ],
  templateUrl: './lista-precificacao.html',
  styleUrl: './lista-precificacao.scss',
})
export class ListaPrecificacao {
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
    { nome: 'Encarte Semanal - 04/11/2025', data: '03/11/2025', status: 'Concluído', produtos: '45 produtos', acoes: '' },
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
