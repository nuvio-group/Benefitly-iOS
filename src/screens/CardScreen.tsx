import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { FakeQrCode } from "../components/FakeQrCode";
import { MerchantLogo } from "../components/MerchantLogo";
import { useActiveMerchant, useMerchantTheme } from "../store/useBenefitlyStore";
import { MerchantConfig } from "../types/merchant";

export function CardScreen() {
  const merchant = useActiveMerchant();
  const theme = useMerchantTheme();
  const { height, width } = useWindowDimensions();
  const cardWidth = Math.min(width - 36, height * 0.56);
  const cardTheme = buildPassTheme(merchant);

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
          <Text style={[styles.eyebrow, { color: theme.muted }]}>Benefitly Wallet</Text>
          <Text style={[styles.title, { color: theme.text }]}>Moja karta</Text>
        </View>

        <Animated.View entering={FadeInDown.duration(360)} style={styles.cardShell}>
          <View style={[styles.passCard, { width: cardWidth, backgroundColor: cardTheme.background }]}>
            <View style={styles.passTop}>
              <View style={styles.passBrand}>
                <View style={styles.logoFrame}>
                  <MerchantLogo logo={merchant.logo} size={46} backgroundColor="#101010" color={cardTheme.accent} />
                </View>
                <Text style={styles.passMerchant} numberOfLines={1}>
                  {cardTheme.name}
                </Text>
              </View>
              <View style={styles.passStatus}>
                <Text style={styles.passLabel}>STAN KARTY</Text>
                <Text style={styles.passStatusValue}>{cardTheme.status}</Text>
              </View>
            </View>

            <ImageBackground source={{ uri: merchant.coverImage }} style={styles.passBanner} imageStyle={styles.passBannerImage}>
              <View style={styles.bannerOverlay} />
            </ImageBackground>

            <View style={styles.passMeta}>
              <View style={styles.metaLeft}>
                <Text style={styles.passLabel}>ID CZŁONKA</Text>
                <Text style={styles.memberId}>{cardTheme.memberId}</Text>
              </View>
              <View style={styles.metaRight}>
                <Text style={styles.passLabel}>NAGRODY</Text>
                <Text style={styles.reward}>{cardTheme.reward}</Text>
              </View>
            </View>

            <View style={styles.qrArea}>
              <FakeQrCode color="#000000" backgroundColor="#FFFFFF" size={154} quietZone={12} gap={3} />
              <Text style={styles.qrCodeNumber}>{cardTheme.memberId}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(90).duration(320)}>
          <Pressable style={styles.appleWalletButton}>
            <AppleWalletGlyph />
            <Text style={styles.appleText}>Dodaj do Portfela Apple</Text>
            <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.62)" />
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AppleWalletGlyph() {
  return (
    <View style={styles.appleGlyph}>
      <View style={[styles.passStripe, styles.passBlue]} />
      <View style={[styles.passStripe, styles.passYellow]} />
      <View style={[styles.passStripe, styles.passGreen]} />
      <View style={[styles.passStripe, styles.passRed]} />
      <View style={styles.passBody}>
        <View style={styles.passCutout} />
      </View>
    </View>
  );
}

function buildPassTheme(merchant: MerchantConfig) {
  return {
    accent: merchant.primaryColor,
    background: "#101010",
    memberId: "0864 7240",
    name: merchant.merchantName,
    reward:
      merchant.loyaltyProgramType === "cashback"
        ? "Twój dostępny cashback"
        : `${merchant.currentBalance.toLocaleString("pl-PL")} pkt`,
    status: merchant.loyaltyProgramType === "cashback" ? "0.00 PLN" : "0",
  };
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingBottom: 126,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  header: {
    marginBottom: 14,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0,
  },
  cardShell: {
    alignItems: "center",
  },
  passCard: {
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 26,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
  },
  passTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 86,
    paddingHorizontal: 18,
  },
  passBrand: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 12,
    minWidth: 0,
  },
  logoFrame: {
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 26,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  passMerchant: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0,
  },
  passStatus: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  passLabel: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
  passStatusValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "300",
    marginTop: 2,
  },
  passBanner: {
    height: 132,
  },
  passBannerImage: {
    resizeMode: "cover",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  passMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 22,
  },
  metaLeft: {
    flex: 1,
  },
  metaRight: {
    alignItems: "flex-end",
    flex: 1.25,
  },
  memberId: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "300",
    letterSpacing: 1,
    marginTop: 7,
  },
  reward: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "300",
    marginTop: 7,
    textAlign: "right",
  },
  qrArea: {
    alignItems: "center",
    paddingBottom: 26,
    paddingTop: 52,
  },
  qrCodeNumber: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 4,
    marginTop: 15,
  },
  appleWalletButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#070707",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    height: 38,
    marginTop: 12,
    paddingHorizontal: 10,
    width: 218,
  },
  appleGlyph: {
    backgroundColor: "#E4E1D8",
    borderRadius: 6,
    height: 25,
    overflow: "hidden",
    width: 31,
  },
  passStripe: {
    height: 3,
    left: 0,
    position: "absolute",
    right: 0,
  },
  passBlue: {
    backgroundColor: "#2BA7DA",
    top: 0,
  },
  passYellow: {
    backgroundColor: "#F5B332",
    top: 3,
  },
  passGreen: {
    backgroundColor: "#38B66E",
    top: 6,
  },
  passRed: {
    backgroundColor: "#F06C5F",
    top: 9,
  },
  passBody: {
    backgroundColor: "#D8D5CB",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    bottom: 0,
    height: 15,
    left: 0,
    position: "absolute",
    right: 0,
  },
  passCutout: {
    alignSelf: "center",
    backgroundColor: "#F06C5F",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    height: 5,
    marginTop: -1,
    width: 11,
  },
  appleText: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0,
  },
});
