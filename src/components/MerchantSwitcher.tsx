import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useBenefitlyStore } from "../store/useBenefitlyStore";
import { accentOn, textOn } from "../theme/themeEngine";
import { MerchantConfig } from "../types/merchant";
import { MerchantLogo } from "./MerchantLogo";

type MerchantSwitcherProps = {
  activeMerchant: MerchantConfig;
};

export function MerchantSwitcher({ activeMerchant }: MerchantSwitcherProps) {
  const merchants = useBenefitlyStore((state) => state.merchants);
  const setActiveMerchant = useBenefitlyStore((state) => state.setActiveMerchant);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Jedna aplikacja. Wszystkie Twoje ulubione miejsca.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.logos}>
        {merchants.map((merchant) => {
          const selected = merchant.id === activeMerchant.id;
          const selectedColor = accentOn("#FFFFFF", merchant.primaryColor);
          return (
            <Pressable
              key={merchant.id}
              onPress={() => setActiveMerchant(merchant.id)}
              style={[
                styles.logoButton,
                selected && {
                  backgroundColor: selectedColor,
                  borderColor: selectedColor,
                },
              ]}
            >
              <MerchantLogo
                logo={merchant.logo}
                size={42}
                backgroundColor={selected ? "#FFFFFF" : merchant.surfaceColor}
                color={selected ? selectedColor : textOn(merchant.surfaceColor)}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
  },
  label: {
    color: "#1B1820",
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 18,
  },
  logos: {
    alignItems: "center",
    gap: 8,
    paddingLeft: 12,
  },
  logoButton: {
    alignItems: "center",
    borderColor: "rgba(10,10,10,0.08)",
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
});
