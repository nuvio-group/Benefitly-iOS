import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MerchantLogo } from "../components/MerchantLogo";
import { useBenefitlyStore, useMerchantTheme } from "../store/useBenefitlyStore";
import { accentOn, borderOn, isDarkColor, mutedOn, textOn } from "../theme/themeEngine";

const mapPinPositions = [
  { left: "17%", top: "38%" },
  { left: "39%", top: "27%" },
  { left: "62%", top: "50%" },
  { left: "78%", top: "34%" },
  { left: "48%", top: "70%" },
] as const;

const nearbyCardColor = "#FFFFFF";

export function DiscoverScreen() {
  const merchants = useBenefitlyStore((state) => state.merchants);
  const activeMerchantId = useBenefitlyStore((state) => state.activeMerchantId);
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
          <Text style={[styles.title, { color: theme.backgroundText }]}>Odkryj</Text>
          <Text style={[styles.subtitle, { color: theme.backgroundMuted }]}>Merchanci, promocje i nagrody w pobliżu</Text>
        </View>

        <View style={styles.map}>
          <View style={styles.mapLand} />
          <View style={[styles.road, styles.roadMain]} />
          <View style={[styles.road, styles.roadSecond]} />
          <View style={[styles.road, styles.roadThird]} />
          <View style={[styles.road, styles.roadVertical]} />
          <View style={[styles.road, styles.roadDiagonal]} />
          <View style={[styles.block, styles.blockOne]} />
          <View style={[styles.block, styles.blockTwo]} />
          <View style={[styles.block, styles.blockThree]} />
          <View style={[styles.block, styles.blockFour]} />
          <Text style={[styles.mapLabel, styles.mapLabelTop]}>Centrum</Text>
          <Text style={[styles.mapLabel, styles.mapLabelBottom]}>Nuvio Nearby</Text>
          {merchants.map((merchant, index) => {
            const selected = merchant.id === activeMerchantId;
            const pinAccent = accentOn("#FFFFFF", merchant.primaryColor);
            const pinTextColor = textOn(pinAccent);
            const position = mapPinPositions[index % mapPinPositions.length];

            return (
              <Pressable
                key={merchant.id}
                onPress={() => setActiveMerchant(merchant.id)}
                style={[
                  styles.pin,
                  selected && styles.pinSelected,
                  {
                    backgroundColor: selected ? pinAccent : "#FFFFFF",
                    borderColor: selected ? "#FFFFFF" : "rgba(17,24,39,0.16)",
                    left: position.left,
                    top: position.top,
                  },
                ]}
              >
                <Text style={[styles.pinText, { color: selected ? pinTextColor : "#111827" }]}>{merchant.logo}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.backgroundText }]}>W pobliżu</Text>
        {merchants.map((merchant) => {
          const selected = merchant.id === activeMerchantId;
          const cardText = textOn(nearbyCardColor);
          const cardMuted = mutedOn(nearbyCardColor);
          const cardAccent = accentOn(nearbyCardColor, merchant.primaryColor);
          const selectedOutline = isDarkColor(theme.background) ? "#FF8A2A" : accentOn(theme.background, merchant.primaryColor);

          return (
            <Pressable
              key={merchant.id}
              onPress={() => setActiveMerchant(merchant.id)}
              style={[
                styles.merchantCard,
                {
                  backgroundColor: nearbyCardColor,
                  borderColor: selected ? selectedOutline : borderOn(nearbyCardColor),
                  borderWidth: selected ? 3 : 1,
                  shadowColor: selected ? selectedOutline : "#000000",
                },
                selected && styles.merchantCardSelected,
              ]}
            >
              <Image source={{ uri: merchant.coverImage }} style={styles.cover} />
              <View
                style={[
                  styles.cardOverlay,
                  { backgroundColor: "rgba(255,255,255,0.78)" },
                ]}
              />
              <View style={styles.cardContent}>
                <MerchantLogo logo={merchant.logo} size={48} backgroundColor="#0B1020" color={accentOn("#0B1020", merchant.primaryColor)} />
                <View style={styles.merchantCopy}>
                  <View style={styles.merchantTitleRow}>
                    <Text style={[styles.merchantName, { color: cardText }]} numberOfLines={1}>
                      {merchant.merchantName}
                    </Text>
                    {selected ? (
                      <View style={[styles.selectedBadge, { backgroundColor: cardAccent }]}>
                        <Text style={[styles.selectedBadgeText, { color: textOn(cardAccent) }]}>Wybrano</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={[styles.merchantMeta, { color: cardMuted }]}>
                    {merchant.promotions[0].title}
                  </Text>
                </View>
                <Ionicons name={selected ? "checkmark-circle" : "chevron-forward"} size={selected ? 25 : 22} color={cardAccent} />
              </View>
            </Pressable>
          );
        })}
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
    backgroundColor: "#E8F0F1",
    borderRadius: 26,
    height: 230,
    marginBottom: 24,
    overflow: "hidden",
  },
  mapLand: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E9F1ED",
  },
  road: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(130,145,150,0.24)",
    borderWidth: 1,
    position: "absolute",
  },
  roadMain: {
    height: 32,
    left: -20,
    top: 86,
    transform: [{ rotate: "-9deg" }],
    width: 430,
  },
  roadSecond: {
    height: 24,
    left: -40,
    top: 151,
    transform: [{ rotate: "7deg" }],
    width: 430,
  },
  roadThird: {
    height: 18,
    left: 50,
    top: 44,
    transform: [{ rotate: "18deg" }],
    width: 300,
  },
  roadVertical: {
    height: 280,
    left: 150,
    top: -24,
    transform: [{ rotate: "8deg" }],
    width: 26,
  },
  roadDiagonal: {
    height: 22,
    left: 178,
    top: 117,
    transform: [{ rotate: "-38deg" }],
    width: 260,
  },
  block: {
    backgroundColor: "rgba(129,180,154,0.22)",
    borderColor: "rgba(80,120,98,0.12)",
    borderRadius: 18,
    borderWidth: 1,
    position: "absolute",
  },
  blockOne: {
    height: 58,
    left: 24,
    top: 22,
    width: 92,
  },
  blockTwo: {
    height: 68,
    right: 24,
    top: 22,
    width: 118,
  },
  blockThree: {
    bottom: 18,
    height: 52,
    left: 34,
    width: 124,
  },
  blockFour: {
    bottom: 26,
    height: 48,
    right: 42,
    width: 104,
  },
  mapLabel: {
    color: "rgba(17,24,39,0.42)",
    fontSize: 12,
    fontWeight: "900",
    position: "absolute",
  },
  mapLabelTop: {
    left: 28,
    top: 28,
  },
  mapLabelBottom: {
    bottom: 30,
    right: 30,
  },
  pin: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 3,
    height: 46,
    justifyContent: "center",
    position: "absolute",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    width: 46,
  },
  pinSelected: {
    borderRadius: 27,
    height: 54,
    marginLeft: -4,
    marginTop: -4,
    shadowOpacity: 0.28,
    width: 54,
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
  merchantCardSelected: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
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
    minWidth: 0,
  },
  merchantTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minWidth: 0,
  },
  merchantName: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: "900",
  },
  selectedBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectedBadgeText: {
    fontSize: 10,
    fontWeight: "900",
  },
  merchantMeta: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 5,
  },
});
