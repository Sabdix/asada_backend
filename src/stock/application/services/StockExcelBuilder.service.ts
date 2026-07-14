import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ProductCategoryService } from './ProductCategory.service';
import { ProductService } from './Product.service';

export interface StockReportItem {
  producto: string;
  unidadMedida: string;
  pedido: number;
}

@Injectable()
export class StockExcelBuilderService {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
    private readonly productService: ProductService,
  ) {}

  /**
   * Builds an Excel buffer with products grouped by category in columns side by side.
   * Format: | PRODUCTO CAT1 | PRESENT | PEDIDO | PRODUCTO CAT2 | PRESENT | PEDIDO | ...
   */
  async buildReport(
    items: StockReportItem[],
    fecha: string,
  ): Promise<Buffer> {
    // 1. Get all categories
    const categories = await this.productCategoryService.getProductCategories();

    // 2. Get all products with their category
    const allProducts = await this.productService.getProducts();

    // 3. Build a map: productName -> categoryName
    const productCategoryMap = new Map<string, string>();
    for (const product of allProducts) {
      if (product.category) {
        productCategoryMap.set(
          product.name.toUpperCase(),
          product.category.name.toUpperCase(),
        );
      }
    }

    // 4. Group items by category
    const grouped = new Map<string, StockReportItem[]>();
    for (const cat of categories) {
      grouped.set(cat.name.toUpperCase(), []);
    }

    for (const item of items) {
      const categoryName = productCategoryMap.get(item.producto.toUpperCase());
      if (categoryName && grouped.has(categoryName)) {
        grouped.get(categoryName)!.push(item);
      } else {
        // If category not found, put in first available
        const firstKey = grouped.keys().next().value;
        if (firstKey) grouped.get(firstKey)!.push(item);
      }
    }

    // 5. Build Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pedido Bodega');

    const categoryEntries = Array.from(grouped.entries()).filter(
      ([, items]) => items.length > 0 || true,
    );
    const numCategories = categoryEntries.length;
    const maxRows = Math.max(...categoryEntries.map(([, items]) => items.length), 0);

    // Row 1: fecha header
    const fechaCell = worksheet.getCell(1, 1);
    fechaCell.value = '.';
    // Merge area for PZ label (optional visual grouping)
    if (numCategories > 1) {
      const midStart = 4;
      const midEnd = 6;
      worksheet.mergeCells(1, midStart, 1, midEnd);
      worksheet.getCell(1, midStart).value = 'PZ';
      worksheet.getCell(1, midStart).alignment = { horizontal: 'center' };
    }
    // Fecha on the right side
    const fechaCol = (numCategories - 1) * 3 + 4;
    worksheet.getCell(1, fechaCol).value = `FECHA: ${fecha}`;
    worksheet.getCell(1, fechaCol).font = { bold: true };

    // Row 2: category headers
    for (let i = 0; i < numCategories; i++) {
      const startCol = i * 3 + 1;
      const [categoryName] = categoryEntries[i];

      worksheet.getCell(2, startCol).value = `PRODUCTO\n${categoryName}`;
      worksheet.getCell(2, startCol).font = { bold: true };
      worksheet.getCell(2, startCol).alignment = { wrapText: true, vertical: 'middle' };

      worksheet.getCell(2, startCol + 1).value = 'PRESENT';
      worksheet.getCell(2, startCol + 1).font = { bold: true };
      worksheet.getCell(2, startCol + 1).alignment = { horizontal: 'center' };

      worksheet.getCell(2, startCol + 2).value = 'PEDIDO';
      worksheet.getCell(2, startCol + 2).font = { bold: true };
      worksheet.getCell(2, startCol + 2).alignment = { horizontal: 'center' };

      // Set column widths
      worksheet.getColumn(startCol).width = 22;
      worksheet.getColumn(startCol + 1).width = 10;
      worksheet.getColumn(startCol + 2).width = 10;
    }

    // Row 3+: data rows
    for (let row = 0; row < maxRows; row++) {
      for (let i = 0; i < numCategories; i++) {
        const startCol = i * 3 + 1;
        const [, categoryItems] = categoryEntries[i];
        const item = categoryItems[row];

        if (item) {
          worksheet.getCell(row + 3, startCol).value = item.producto.toUpperCase();
          worksheet.getCell(row + 3, startCol + 1).value = item.unidadMedida.toUpperCase();
          worksheet.getCell(row + 3, startCol + 2).value =
            item.pedido > 0 ? item.pedido : '';
        }
      }
    }

    // Style: add borders and colors per category
    const categoryColors = ['FFE2EFDA', 'FFFFF2CC', 'FFFCE4D6', 'FFDDEBF7', 'FFE4DFEC'];
    for (let i = 0; i < numCategories; i++) {
      const startCol = i * 3 + 1;
      const color = categoryColors[i % categoryColors.length];

      // Color header row
      for (let c = startCol; c <= startCol + 2; c++) {
        const cell = worksheet.getCell(2, c);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: color },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }

      // Color data rows
      for (let row = 0; row < maxRows; row++) {
        for (let c = startCol; c <= startCol + 2; c++) {
          const cell = worksheet.getCell(row + 3, c);
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        }
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer as ArrayBuffer);
  }
}
