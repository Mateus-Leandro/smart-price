export function transformToNumberValue(stringValue: string | number): number {
  if (typeof stringValue === 'number') {
    return stringValue;
  }

  if (!stringValue) return 0;

  const cleanedValue = stringValue.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanedValue);
}
