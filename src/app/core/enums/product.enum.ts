import { IFilterOptions } from 'src/app/shared/components/icon-filter-button/icon-filter-list';
import { EnumSupplierDeliveryTypeEnum } from './supplier.enum';
import { TFlyerType } from '../models/promotional-flyer.model';

export enum ProductPriceType {
  SalePrice = 'SALE_PRICE',
  LoyaltyPrice = 'LOYALTY_PRICE',
}

export enum CostVariationEnum {
  Greater = 'GREATER',
  Less = 'LESS',
}

export enum MarginFilterEnum {
  ALL = 'ALL',
  WITH_MARGIN = 'WITH_MARGIN',
  WITHOUT_MARGIN = 'WITHOUT_MARGIN',
}

export enum EnumWarningProductType {
  CompetitorMargin = 'COMPETITOR_MARGIN',
  CompetitorPrice = 'COMPETITOR_PRICE',
  NoCompetitorPrice = 'NO_COMPETITOR_PRICE',
}

export enum EnumBaseFilterFlyerProducts {
  NoSalePrice = 'NoSalePrice',
  NoLoyaltyPrice = 'NoLoyaltyPrice',
  NoCompetitorPrice = EnumWarningProductType.NoCompetitorPrice,
  NoImported = 'NoImported',
  CompetitorMargin = EnumWarningProductType.CompetitorMargin,
  CompetitorPrice = EnumWarningProductType.CompetitorPrice,
}

export const EnumFilterPromotionalFlyerProducts = {
  ...EnumBaseFilterFlyerProducts,
  SupplierDeliveryPaid: EnumSupplierDeliveryTypeEnum.BH,
  SupplierDeliveryPaidNoDeliveryValue: 'NoDeliveryValue',
  SupplierDeliveryFree: EnumSupplierDeliveryTypeEnum.PORTA,
} as const;

export type EnumFilterPromotionalFlyerProducts =
  (typeof EnumFilterPromotionalFlyerProducts)[keyof typeof EnumFilterPromotionalFlyerProducts];

export const EnumFilterSupplierFlyerProducts = {
  ...EnumBaseFilterFlyerProducts,
  VariationGreater: CostVariationEnum.Greater,
  VariationLess: CostVariationEnum.Less,
} as const;

export type EnumFilterSupplierFlyerProducts =
  (typeof EnumFilterSupplierFlyerProducts)[keyof typeof EnumFilterSupplierFlyerProducts];

export type FlyerFilterValue = EnumFilterPromotionalFlyerProducts | EnumFilterSupplierFlyerProducts;

export function getFlyerFilterOptions(flyerType: TFlyerType): IFilterOptions<FlyerFilterValue>[] {
  const options: IFilterOptions<FlyerFilterValue>[] = [
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
      value: EnumFilterPromotionalFlyerProducts.NoCompetitorPrice,
    },
    {
      label: 'Preço do Concorrente <= Custo',
      value: EnumFilterPromotionalFlyerProducts.CompetitorPrice,
    },
    {
      label: 'Margem do Concorrente < 7%',
      value: EnumFilterPromotionalFlyerProducts.CompetitorMargin,
    },
    {
      label: 'Não Importados no ERP',
      value: EnumFilterPromotionalFlyerProducts.NoImported,
    },
  ];

  if (flyerType === 'quote') {
    options.push(
      {
        label: 'Fornecedor Porta',
        value: EnumFilterPromotionalFlyerProducts.SupplierDeliveryFree,
      },
      {
        label: 'Fornecedor BH - Com Frete',
        value: EnumFilterPromotionalFlyerProducts.SupplierDeliveryPaid,
      },
      {
        label: 'Fornecedor BH - Sem Frete',
        value: EnumFilterPromotionalFlyerProducts.SupplierDeliveryPaidNoDeliveryValue,
      },
    );
  }

  if (flyerType === 'supplier') {
    options.push(
      {
        label: 'Custo Aumentou',
        value: EnumFilterSupplierFlyerProducts.VariationGreater,
      },
      {
        label: 'Custo Diminuiu',
        value: EnumFilterSupplierFlyerProducts.VariationLess,
      },
    );
  }

  return options;
}
