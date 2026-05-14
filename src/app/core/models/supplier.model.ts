import { EnumSupplierDeliveryTypeEnum } from 'src/app/core/enums/supplier.enum';

export interface ISupplier {
  id: number;
  companyId: number;
  cnpj: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISupplierView {
  id: number;
  cnpj: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateSupplier {
  supplierId: number;
  deliveryType: EnumSupplierDeliveryTypeEnum;
}

export interface ISupplierProductView {
  productId: number;
  productName: string;
  brancheId: number;
  brancheName: string;
  margin: number | null;
}

export interface ISupplierProductBranchView {
  brancheId: number;
  brancheName: string;
  margin: number | null;
}

export interface ISupplierProductPivotView {
  productId: number;
  productName: string;
  branches: ISupplierProductBranchView[];
}
