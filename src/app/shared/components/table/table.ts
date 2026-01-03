import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TableColumn } from 'src/app/core/models/table-app.model';

@Component({
  selector: 'app-table',
  imports: [MatButtonModule, MatPaginatorModule, MatTableModule, CommonModule, MatIconModule],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  @Input() data: any[] = [];
  @Input() totalCount: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;
  @Input() columns: TableColumn[] = [];

  @Input() expandedDetailTemplate!: TemplateRef<any>;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() rowToggle = new EventEmitter<any>();

  expandedElement: any | null = null;

  get displayedColumns(): string[] {
    return ['expand', ...this.columns.map((c) => c.key)];
  }

  toggleRow(element: any) {
    this.expandedElement = this.expandedElement === element ? null : element;
    this.rowToggle.emit(this.expandedElement);
  }

  onPageChange(event: PageEvent) {
    this.expandedElement = null;
    this.pageChange.emit(event);
  }
}
