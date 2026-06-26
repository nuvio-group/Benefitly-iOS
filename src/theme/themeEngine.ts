import { MerchantConfig, MerchantTheme } from "../types/merchant";

const DARK_TEXT = "#111827";
const LIGHT_TEXT = "#FFFFFF";
const DARK_MUTED = "rgba(17,24,39,0.68)";
const LIGHT_MUTED = "rgba(255,255,255,0.74)";
const DARK_BORDER = "rgba(17,24,39,0.13)";
const LIGHT_BORDER = "rgba(255,255,255,0.18)";

type Rgb = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export function createMerchantTheme(merchant: MerchantConfig): MerchantTheme {
  const textOnBackground = textOn(merchant.backgroundColor);
  const textOnSurface = textOn(merchant.surfaceColor);

  return {
    primary: merchant.primaryColor,
    secondary: merchant.secondaryColor,
    background: merchant.backgroundColor,
    surface: merchant.surfaceColor,
    text: textOnBackground,
    muted: mutedOn(merchant.backgroundColor),
    backgroundText: textOnBackground,
    backgroundMuted: mutedOn(merchant.backgroundColor),
    surfaceText: textOnSurface,
    surfaceMuted: mutedOn(merchant.surfaceColor),
    onPrimary: textOn(merchant.primaryColor),
    onSecondary: textOn(merchant.secondaryColor),
    primaryOnBackground: accentOn(merchant.backgroundColor, merchant.primaryColor),
    primaryOnSurface: accentOn(merchant.surfaceColor, merchant.primaryColor),
    border: borderOn(merchant.backgroundColor),
    surfaceBorder: borderOn(merchant.surfaceColor),
    textOn,
    mutedOn,
    borderOn,
    accentOn,
    cardGradient: merchant.cardDesign.gradient,
    cardForeground: textOn(merchant.cardDesign.gradient[0]),
    pattern: merchant.cardDesign.patternColor,
  };
}

export function isDarkTheme(merchant: MerchantConfig) {
  return isDarkColor(merchant.backgroundColor);
}

export function textOn(backgroundColor: string) {
  const background = parseColor(backgroundColor);
  if (!background) {
    return DARK_TEXT;
  }

  return contrastRatio(LIGHT_TEXT, backgroundColor) >= contrastRatio(DARK_TEXT, backgroundColor)
    ? LIGHT_TEXT
    : DARK_TEXT;
}

export function mutedOn(backgroundColor: string) {
  return isDarkColor(backgroundColor) ? LIGHT_MUTED : DARK_MUTED;
}

export function borderOn(backgroundColor: string) {
  return isDarkColor(backgroundColor) ? LIGHT_BORDER : DARK_BORDER;
}

export function accentOn(backgroundColor: string, accentColor = DARK_TEXT) {
  return contrastRatio(accentColor, backgroundColor) >= 4.5 ? accentColor : textOn(backgroundColor);
}

export function isDarkColor(color: string) {
  const parsed = parseColor(color);
  if (!parsed) {
    return false;
  }
  return relativeLuminance(parsed) < 0.42;
}

function contrastRatio(foregroundColor: string, backgroundColor: string) {
  const foreground = parseColor(foregroundColor);
  const background = parseColor(backgroundColor);

  if (!foreground || !background) {
    return 0;
  }

  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(color: Rgb) {
  const channel = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
}

function parseColor(color: string): Rgb | undefined {
  const normalized = color.trim();

  if (normalized.startsWith("#")) {
    return parseHexColor(normalized);
  }

  const rgbaMatch = normalized.match(/^rgba?\(([^)]+)\)$/i);
  if (!rgbaMatch) {
    return undefined;
  }

  const values = rgbaMatch[1].split(",").map((value) => value.trim());
  const [r, g, b] = values.slice(0, 3).map(Number);
  const a = values[3] === undefined ? 1 : Number(values[3]);

  if ([r, g, b, a].some((value) => Number.isNaN(value))) {
    return undefined;
  }

  return { r, g, b, a };
}

function parseHexColor(color: string): Rgb | undefined {
  const hex = color.replace("#", "");

  if (![3, 4, 6, 8].includes(hex.length)) {
    return undefined;
  }

  const expanded = hex.length <= 4
    ? hex.split("").map((character) => character + character).join("")
    : hex;

  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);
  const a = expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1;

  if ([r, g, b, a].some((value) => Number.isNaN(value))) {
    return undefined;
  }

  return { r, g, b, a };
}
