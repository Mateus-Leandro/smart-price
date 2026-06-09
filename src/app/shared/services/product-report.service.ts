import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ProductRepository } from 'src/app/core/repositories/product.repository';
import { MarginFilterEnum } from 'src/app/core/enums/product.enum';
import {
  IProductReportFilter,
  IProductReportGenerationResult,
  IProductReportView,
} from 'src/app/core/models/product-report.model';

export interface IProductReportOptions {
  search?: string;
  supplierId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductReportService {
  constructor(private repository: ProductRepository) {}

  generateReport(
    filters: IProductReportFilter,
    options: IProductReportOptions = {},
  ): Observable<IProductReportGenerationResult> {
    const marginFilter = this.getMarginFilter(filters.marginOption);

    return this.repository
      .getProductsReport(marginFilter, options.search, options.supplierId)
      .pipe(
        map((products) => {
          if (!products.length) {
            return {
              generated: false,
              totalProducts: 0,
            };
          }

          const fileName = this.buildFileName(filters);

          if (filters.format === 'pdf') {
            this.exportPdf(products, filters, fileName);
          } else {
            this.exportXlsx(products, filters, fileName);
          }

          return {
            generated: true,
            totalProducts: products.length,
            fileName,
          };
        }),
      );
  }

  private getMarginFilter(marginOption: IProductReportFilter['marginOption']): MarginFilterEnum {
    return marginOption === 'with-margin'
      ? MarginFilterEnum.WITH_MARGIN
      : MarginFilterEnum.WITHOUT_MARGIN;
  }

  private buildFileName(filters: IProductReportFilter): string {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8).replaceAll(':', '-');
    const margin = filters.marginOption === 'with-margin' ? 'with-margin' : 'without-margin';
    return `products-report-${margin}-${date}-${time}`;
  }

  private exportPdf(
    products: IProductReportView[],
    filters: IProductReportFilter,
    fileName: string,
  ): void {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const includeMargin = filters.marginOption === 'with-margin';

    doc.setFontSize(14);
    doc.text('Relatório de produtos', 14, 15);
    doc.setFontSize(10);
    doc.text(
      `Filtro de margem: ${includeMargin ? 'Com margem' : 'Sem margem'} | Total: ${products.length}`,
      14,
      22,
    );

    if (includeMargin) {
      this.exportPdfWithStoreColumns(doc, products);
      doc.save(`${fileName}.pdf`);
      return;
    }

    autoTable(doc, {
      startY: 28,
      head: [['ID', 'Descrição', 'Criado em', 'Alterado em']],
      body: products.map((product) => [
        product.id,
        product.name,
        this.formatDate(product.createdAt),
        this.formatDate(product.updatedAt),
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [0, 121, 107],
      },
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 150 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
      },
    });

    doc.save(`${fileName}.pdf`);
  }

  private exportPdfWithStoreColumns(doc: jsPDF, products: IProductReportView[]): void {
    const companiesMap = new Map<number, string>();
    products.forEach((product) => {
      product.marginBranches.forEach((branch) => {
        if (!companiesMap.has(branch.brancheId)) {
          companiesMap.set(branch.brancheId, branch.brancheName);
        }
      });
    });

    const sortedCompanies = Array.from(companiesMap.entries()).sort((a, b) => a[0] - b[0]);

    const availableWidth = 269; // A4 landscape (297mm) - 2 * 14mm margins
    const idWidth = 15;
    const minProductWidth = 60;
    const storeCount = sortedCompanies.length;
    const storeWidth =
      storeCount > 0
        ? Math.min(28, Math.floor((availableWidth - idWidth - minProductWidth) / storeCount))
        : 28;
    const productWidth = availableWidth - idWidth - storeCount * storeWidth;

    const head = [['ID', 'Produto', ...sortedCompanies.map(([, name]) => name)]];

    const body = products.map((product) => {
      const row: (string | number)[] = [product.id, product.name];
      sortedCompanies.forEach(([brancheId]) => {
        const branch = product.marginBranches.find((b) => b.brancheId === brancheId);
        row.push(branch ? this.formatPercent(branch.margin) : '-');
      });
      return row;
    });

    const columnStyles: Record<number, object> = {
      0: { cellWidth: idWidth },
      1: { cellWidth: productWidth, overflow: 'ellipsize' },
    };
    sortedCompanies.forEach((_, index) => {
      columnStyles[index + 2] = { cellWidth: storeWidth, halign: 'center' };
    });

    autoTable(doc, {
      startY: 28,
      head,
      body,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 121, 107], halign: 'center', fontSize: 7 },
      columnStyles,
    });
  }

  private exportXlsx(
    products: IProductReportView[],
    filters: IProductReportFilter,
    fileName: string,
  ): void {
    const includeMargin = filters.marginOption === 'with-margin';
    const reportRows = includeMargin
      ? this.buildGroupedXlsxRows(products)
      : products.map((product) => ({
          ID: product.id,
          Descricao: product.name,
          CriadoEm: this.formatDate(product.createdAt),
          AlteradoEm: this.formatDate(product.updatedAt),
        }));

    const worksheet = XLSX.utils.json_to_sheet(reportRows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  private buildGroupedXlsxRows(products: IProductReportView[]): Array<Record<string, string>> {
    const companiesMap = new Map<number, string>();
    products.forEach((product) => {
      product.marginBranches.forEach((branch) => {
        if (!companiesMap.has(branch.brancheId)) {
          companiesMap.set(branch.brancheId, branch.brancheName);
        }
      });
    });

    const sortedCompanies = Array.from(companiesMap.entries()).sort((a, b) => a[0] - b[0]);

    return products.map((product) => {
      const row: Record<string, string> = { ID: String(product.id), Produto: product.name };
      sortedCompanies.forEach(([brancheId, companyName]) => {
        const branch = product.marginBranches.find((b) => b.brancheId === brancheId);
        row[companyName] = branch ? this.formatPercent(branch.margin) : '-';
      });
      return row;
    });
  }

  private formatPercent(value: number): string {
    return `${value.toFixed(2).replace('.', ',')}%`;
  }

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(value));
  }
}
