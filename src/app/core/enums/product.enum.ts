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
  NoCompetitorPrice = 'NO_COMPETITOR_PRICE',
}

export enum EnumFilterPromotionalFlyerProducts {
  NoSalePrice = 'NoSalePrice',
  NoLoyaltyPrice = 'NoLoyaltyPrice',
  NoCompetitorPrice = EnumWarningProductType.NoCompetitorPrice,
  NoImported = 'NoImported',
  CompetitorMargin = EnumWarningProductType.CompetitorMargin,
  CompetitorPrice = EnumWarningProductType.CompetitorPrice,
  SupplierDeliveryPaid = EnumSupplierDeliveryTypeEnum.BH,
  SupplierDeliveryPaidNoDeliveryValue = 'NoDeliveryValue',
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
      value: EnumWarningProductType.NoCompetitorPrice,
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
      label: 'Fornecedor Porta',
      value: EnumSupplierDeliveryTypeEnum.PORTA,
    },
    {
      label: 'Fornecedor BH - Com Frete',
      value: EnumSupplierDeliveryTypeEnum.BH,
    },
    {
      label: 'Fornecedor BH - Sem Frete',
      value: EnumFilterPromotionalFlyerProducts.SupplierDeliveryPaidNoDeliveryValue,
    },
  ];
}
