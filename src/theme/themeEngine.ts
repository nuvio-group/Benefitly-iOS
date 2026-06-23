import { MerchantConfig, MerchantTheme } from "../types/merchant";

export function createMerchantTheme(merchant: MerchantConfig): MerchantTheme {
  return {
    primary: merchant.primaryColor,
    secondary: merchant.secondaryColor,
    background: merchant.backgroundColor,
    surface: merchant.surfaceColor,
    text: merchant.textColor,
    muted: merchant.mutedTextColor,
    cardGradient: merchant.cardDesign.gradient,
    cardForeground: merchant.cardDesign.foregroundColor,
    pattern: merchant.cardDesign.patternColor,
  };
}

export function isDarkTheme(merchant: MerchantConfig) {
  return merchant.backgroundColor === "#111213";
}
