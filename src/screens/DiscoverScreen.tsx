import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MerchantLogo } from "../components/MerchantLogo";
import { useBenefitlyStore, useMerchantTheme } from "../store/useBenefitlyStore";

export function DiscoverScreen() {
  const merchants = useBenefitlyStore((state) => state.merchants);
  const setActiveMerchant = useBenefitlyStore((state) => state.setActiveMerchant);
  const theme = useMerchantTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Odkryj</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>Merchanci, promocje i nagrody w pobliżu</Text>
        </View>

        <View style={styles.map}>
          <View style={[styles.mapWater, styles.mapWaterTop]} />
          <View style={[styles.mapWater, styles.mapWaterBottom]} />
          {merchants.map((merchant, index) => (
            <Pressable
              key={merchant.id}
              onPress={() => setActiveMerchant(merchant.id)}
              style={[
                styles.pin,
                {
                  backgroundColor: merchant.primaryColor,
                  left: `${18 + index * 19}%`,
                  top: `${index % 2 === 0 ? 30 : 56}%`,
                },
              ]}
            >
              <Text style={styles.pinText}>{merchant.logo}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>W pobliżu</Text>
        {merchants.map((merchant) => (
          <Pressable
            key={merchant.id}
            onPress={() => setActiveMerchant(merchant.id)}
            style={[styles.merchantCard, { backgroundColor: merchant.surfaceColor }]}
          >
            <Image source={{ uri: merchant.coverImage }} style={styles.cover} />
            <View style={styles.cardOverlay} />
            <View style={styles.cardContent}>
              <MerchantLogo logo={merchant.logo} size={48} backgroundColor="#FFFFFF" color={merchant.primaryColor} />
              <View style={styles.merchantCopy}>
                <Text style={[styles.merchantName, { color: merchant.textColor }]}>{merchant.merchantName}</Text>
                <Text style={[styles.merchantMeta, { color: merchant.mutedTextColor }]}>
                  {merchant.promotions[0].title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={merchant.primaryColor} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingBottom: 126,
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 4,
  },
  map: {
    backgroundColor: "#DCEEF0",
    borderRadius: 26,
    height: 230,
    marginBottom: 24,
    overflow: "hidden",
  },
  mapWater: {
    backgroundColor: "rgba(255,255,255,0.46)",
    height: 80,
    position: "absolute",
    transform: [{ rotate: "-14deg" }],
    width: 420,
  },
  mapWaterTop: {
    left: -40,
    top: 18,
  },
  mapWaterBottom: {
    left: -20,
    top: 134,
  },
  pin: {
    alignItems: "center",
    borderColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 4,
    height: 48,
    justifyContent: "center",
    position: "absolute",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    width: 48,
  },
  pinText: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 14,
  },
  merchantCard: {
    borderRadius: 20,
    marginBottom: 14,
    minHeight: 104,
    overflow: "hidden",
  },
  cover: {
    height: "100%",
    position: "absolute",
    right: 0,
    width: 132,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.74)",
  },
  cardContent: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 104,
    padding: 16,
  },
  merchantCopy: {
    flex: 1,
    marginLeft: 14,
  },
  merchantName: {
    fontSize: 17,
    fontWeight: "900",
  },
  merchantMeta: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 5,
  },
});
