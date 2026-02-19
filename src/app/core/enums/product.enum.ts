import { IFilterOptions } from 'src/app/shared/components/icon-filter-button/icon-filter-list';
import { EnumSupplierDeliveryTypeEnum } from './supplier.enum';

export enum ProductPriceType {
  SalePrice = 'SALE_PRICE',
  LoyaltyPrice = 'LOYALTY_PRICE',
}

export enum MarginFilterEnum {
  'ALL',
  'WITH_MARGIN',
  'WITHOUT_MARGIN',
}
export enum EnumWarningProductType {
  CompetitorMargin = 'COMPETITOR_MARGIN',
  CompetitorPrice = 'COMPETITOR_PRICE',
}

export enum EnumFilterPromotionalFlyerProducts {
  NoSalePrice = 'NoSalePrice',
  NoLoyaltyPrice = 'NoLoyaltyPrice',
  NoCompetingPrice = 'NoCompetingPrice',
  NoImported = 'NoImported',
  CompetitorMargin = EnumWarningProductType.CompetitorMargin,
  CompetitorPrice = EnumWarningProductType.CompetitorPrice,
  SupplierDeliveryPaid = EnumSupplierDeliveryTypeEnum.BH,
  SupplierDeliveryFree = EnumSupplierDeliveryTypeEnum.PORTA,
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
      label: 'Preço do Concorrente <= Custo',
      value: EnumWarningProductType.CompetitorPrice,
    },
    {
      label: 'Margem do Concorrente < 7%',
      value: EnumWarningProductType.CompetitorMargin,
    },
    {
      label: 'Não Importados no ERP',
      value: EnumFilterPromotionalFlyerProducts.NoImported,
    },
    {
      label: 'Sem Frete (Fornecedor Porta)',
      value: EnumSupplierDeliveryTypeEnum.PORTA,
    },
    {
      label: 'Com Frete (Fornecedor BH)',
      value: EnumSupplierDeliveryTypeEnum.BH,
    },
  ];
}
