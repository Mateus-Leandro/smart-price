import { IFilterOptions } from 'src/app/shared/components/icon-filter-button/icon-filter-list';

export enum ProductPriceType {
  SalePrice = 'SALE_PRICE',
  LoyaltyPrice = 'LOYALTY_PRICE',
}

export enum MarginFilterEnum {
  'ALL',
  'WITH_MARGIN',
  'WITHOUT_MARGIN',
}

export enum EnumFilterPromotionalFlyerProducts {
  NoSalePrice = 'NoSalePrice',
  NoLoyaltyPrice = 'NoLoyaltyPrice',
  NoCompetingPrice = 'NoCompetingPrice',
  NoImported = 'NoImported',
}

export function getPromotionalFlyerProductsFilterOptions(): IFilterOptions<EnumFilterPromotionalFlyerProducts>[] {
  return [
    {
      label: 'Sem Preço de Venda',
      value: EnumFilterPromotionalFlyerProducts.NoSalePrice,
    },
    {
      label: 'Sem Preço Fidelidade',
      value: EnumFilterPromotionalFlyerProducts.NoLoyaltyPrice,
    },
    {
      label: 'Sem Preço dos Concorrentes',
      value: EnumFilterPromotionalFlyerProducts.NoCompetingPrice,
    },
    {
      label: 'Não Importados no ERP',
      value: EnumFilterPromotionalFlyerProducts.NoImported,
    },
  ];
}
