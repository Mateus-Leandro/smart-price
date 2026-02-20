export interface ISupplierShippingPrice {
  companyId: number;
  supplierId: number;
  productId: number;
  shippingPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateSupplierShippingPrice {
  company_id: number;
  supplierId: number;
  productId: number;
  deliveryCost: number;
}

export interface IDeleteSupplierShippingPrice {
  supplierId: number;
  productId: number;
}
