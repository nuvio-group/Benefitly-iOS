import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { FakeQrCode } from "../components/FakeQrCode";
import { MerchantLogo } from "../components/MerchantLogo";
import { useActiveMerchant, useBenefitlyStore, useMerchantTheme } from "../store/useBenefitlyStore";
import { MerchantConfig } from "../types/merchant";

export function CardScreen() {
  const merchant = useActiveMerchant();
  const theme = useMerchantTheme();
  const cardGenerated = useBenefitlyStore((state) => Boolean(state.generatedCards[merchant.id]));
  const generateMerchantCard = useBenefitlyStore((state) => state.generateMerchantCard);
  const { height, width } = useWindowDimensions();
  const cardWidth = Math.min((width - 36) * 0.85, height * 0.47);
  const cardTheme = buildPassTheme(merchant);
  const generateFill = theme.primaryOnBackground;
  const generateText = theme.textOn(generateFill);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: theme.backgroundMuted }]}>Benefitly Wallet</Text>
          <Text style={[styles.title, { color: theme.backgroundText }]}>Moja karta</Text>
        </View>

        {cardGenerated ? (
          <>
            <Animated.View entering={FadeInDown.duration(360)} style={styles.cardShell}>
              <View style={[styles.passCard, { width: cardWidth, backgroundColor: cardTheme.background }]}>
                <View style={styles.passTop}>
                  <View style={styles.passBrand}>
                    <View style={styles.logoFrame}>
                      <MerchantLogo logo={merchant.logo} size={38} backgroundColor="#101010" color={cardTheme.accent} />
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
                  <FakeQrCode color="#000000" backgroundColor="#FFFFFF" size={131} quietZone={10} gap={3} />
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
          </>
        ) : (
          <Animated.View entering={FadeInDown.duration(360)} style={styles.cardShell}>
            <View style={[styles.emptyCard, { width: cardWidth, borderColor: theme.border }]}>
              <MerchantLogo logo={merchant.logo} size={58} backgroundColor={generateFill} color={generateText} />
              <Text style={[styles.emptyTitle, { color: theme.backgroundText }]}>{merchant.merchantName}</Text>
              <Text style={[styles.emptySubtitle, { color: theme.backgroundMuted }]}>
                Karta lojalnościowa jest gotowa do utworzenia.
              </Text>
              <Pressable
                onPress={() => generateMerchantCard(merchant.id)}
                style={[styles.generateButton, { backgroundColor: generateFill }]}
              >
                <Ionicons name="sparkles-outline" size={20} color={generateText} />
                <Text style={[styles.generateText, { color: generateText }]}>Generuj kartę</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </View>
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
    flex: 1,
    justifyContent: "flex-start",
    paddingBottom: 126,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  header: {
    marginBottom: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0,
  },
  cardShell: {
    alignItems: "center",
  },
  emptyCard: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    minHeight: 398,
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 18,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 8,
    textAlign: "center",
  },
  generateButton: {
    alignItems: "center",
    borderRadius: 18,
    flexDirection: "row",
    gap: 8,
    height: 54,
    justifyContent: "center",
    marginTop: 24,
    paddingHorizontal: 22,
    width: "100%",
  },
  generateText: {
    fontSize: 17,
    fontWeight: "900",
  },
  passCard: {
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 22,
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
    minHeight: 72,
    paddingHorizontal: 15,
  },
  passBrand: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 10,
    minWidth: 0,
  },
  logoFrame: {
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  passMerchant: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: 0,
  },
  passStatus: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  passLabel: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2,
  },
  passStatusValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "300",
    marginTop: 2,
  },
  passBanner: {
    height: 112,
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
    paddingHorizontal: 15,
    paddingTop: 18,
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
    fontSize: 21,
    fontWeight: "300",
    letterSpacing: 1,
    marginTop: 6,
  },
  reward: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "300",
    marginTop: 6,
    textAlign: "right",
  },
  qrArea: {
    alignItems: "center",
    paddingBottom: 22,
    paddingTop: 34,
  },
  qrCodeNumber: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 4,
    marginTop: 12,
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
    marginTop: 10,
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
