import React from "react";
import { StyleSheet, Text, View } from "react-native";

type MerchantLogoProps = {
  logo: string;
  size?: number;
  backgroundColor?: string;
  color?: string;
};

export function MerchantLogo({
  logo,
  size = 58,
  backgroundColor = "#FFFFFF",
  color = "#111111",
}: MerchantLogoProps) {
  return (
    <View
      style={[
        styles.logo,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      <Text style={[styles.logoText, { color, fontSize: size > 48 ? 28 : 20 }]}>{logo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  logoText: {
    fontWeight: "800",
  },
});
