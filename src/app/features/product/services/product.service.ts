import { Injectable } from '@angular/core';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { ProductRepository } from 'src/app/core/repositories/product.repository';
import { IProductView } from 'src/app/core/models/product.model';
import { MarginFilterEnum } from 'src/app/core/enums/product.enum';
import {
  IProductReportByCompany,
  IProductReportFilter,
  IProductReportGenerationResult,
  IProductReportView,
} from '../models/product-report.model';
import { map, Observable } from 'rxjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private repository: ProductRepository) {}

  loadProducts(
    paginator: IDefaultPaginatorDataSource<IProductView>,
    marginFilter: MarginFilterEnum,
    search?: string,
  ) {
    return this.repository.getProducts(paginator, marginFilter, search);
  }

  generateProductsReport(
    filters: IProductReportFilter,
    search?: string,
  ): Observable<IProductReportGenerationResult> {
    const marginFilter = this.getMarginFilter(filters.marginOption);

    return this.repository.getProductsReport(marginFilter, search).pipe(
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
      this.exportPdfGroupedByCompany(doc, products);
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

  private exportPdfGroupedByCompany(doc: jsPDF, products: IProductReportView[]): void {
    const groupedProducts = this.groupProductsByCompany(products);
    let currentY = 30;

    groupedProducts.forEach((group, index) => {
      if (currentY > 180) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(12);
      doc.text(`Empresa: ${group.companyName}`, 14, currentY);

      autoTable(doc, {
        startY: currentY + 4,
        head: [['Produto', 'Margem']],
        body: group.products.map((product) => [
          product.productName,
          this.formatPercent(product.margin),
        ]),
        styles: {
          fontSize: 9,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [0, 121, 107],
        },
        columnStyles: {
          0: { cellWidth: 210 },
          1: { cellWidth: 40 },
        },
      });

      currentY =
        (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? currentY;
      currentY += index < groupedProducts.length - 1 ? 12 : 0;
    });
  }

  private buildGroupedXlsxRows(products: IProductReportView[]): Array<Record<string, string>> {
    const groupedProducts = this.groupProductsByCompany(products);
    const rows: Array<Record<string, string>> = [];

    groupedProducts.forEach((group) => {
      rows.push({ Empresa: `Empresa: ${group.companyName}`, Produto: '', Margem: '' });
      rows.push({ Empresa: '', Produto: 'Produto', Margem: 'Margem' });

      group.products.forEach((product) => {
        rows.push({
          Empresa: '',
          Produto: product.productName,
          Margem: this.formatPercent(product.margin),
        });
      });

      rows.push({ Empresa: '', Produto: '', Margem: '' });
    });

    return rows;
  }

  private groupProductsByCompany(products: IProductReportView[]): IProductReportByCompany[] {
    const groupedMap = new Map<string, IProductReportByCompany['products']>();

    products.forEach((product) => {
      product.marginBranches.forEach((marginBranch) => {
        const companyProducts = groupedMap.get(marginBranch.brancheName) ?? [];
        companyProducts.push({
          productName: product.name,
          margin: marginBranch.margin,
        });
        groupedMap.set(marginBranch.brancheName, companyProducts);
      });
    });

    return Array.from(groupedMap.entries())
      .map(([companyName, companyProducts]) => ({
        companyName,
        products: companyProducts.sort((a, b) => a.productName.localeCompare(b.productName)),
      }))
      .sort((a, b) => a.companyName.localeCompare(b.companyName));
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
