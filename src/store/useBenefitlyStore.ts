import { create } from "zustand";

import { merchants } from "../config/merchants";
import { createMerchantTheme } from "../theme/themeEngine";
import { MerchantConfig, MerchantTheme } from "../types/merchant";

type BenefitlyState = {
  merchants: MerchantConfig[];
  activeMerchantId: string;
  generatedCards: Record<string, boolean>;
  setActiveMerchant: (merchantId: string) => void;
  generateMerchantCard: (merchantId: string) => void;
  cycleMerchant: () => void;
};

export const useBenefitlyStore = create<BenefitlyState>((set, get) => ({
  merchants,
  activeMerchantId: merchants[0].id,
  generatedCards: {},
  setActiveMerchant: (merchantId) => set({ activeMerchantId: merchantId }),
  generateMerchantCard: (merchantId) =>
    set((state) => ({
      generatedCards: {
        ...state.generatedCards,
        [merchantId]: true,
      },
    })),
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
