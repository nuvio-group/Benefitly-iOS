import { create } from "zustand";

import { merchants } from "../config/merchants";
import { createMerchantTheme } from "../theme/themeEngine";
import { MerchantConfig, MerchantTheme } from "../types/merchant";

type BenefitlyState = {
  merchants: MerchantConfig[];
  activeMerchantId: string;
  setActiveMerchant: (merchantId: string) => void;
  cycleMerchant: () => void;
};

export const useBenefitlyStore = create<BenefitlyState>((set, get) => ({
  merchants,
  activeMerchantId: merchants[0].id,
  setActiveMerchant: (merchantId) => set({ activeMerchantId: merchantId }),
  cycleMerchant: () => {
    const state = get();
    const index = state.merchants.findIndex((merchant) => merchant.id === state.activeMerchantId);
    const next = state.merchants[(index + 1) % state.merchants.length];
    set({ activeMerchantId: next.id });
  },
}));

export function useActiveMerchant(): MerchantConfig {
  return useBenefitlyStore((state) => {
    return (
      state.merchants.find((merchant) => merchant.id === state.activeMerchantId) ??
      state.merchants[0]
    );
  });
}

export function useMerchantTheme(): MerchantTheme {
  const merchant = useActiveMerchant();
  return createMerchantTheme(merchant);
}
