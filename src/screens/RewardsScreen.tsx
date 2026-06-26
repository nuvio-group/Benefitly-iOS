import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProgressBar } from "../components/ProgressBar";
import { useActiveMerchant, useMerchantTheme } from "../store/useBenefitlyStore";

export function RewardsScreen() {
  const merchant = useActiveMerchant();
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
          <Text style={[styles.title, { color: theme.backgroundText }]}>Nagrody</Text>
          <Text style={[styles.subtitle, { color: theme.backgroundMuted }]}>{merchant.merchantName}</Text>
        </View>

        <View style={[styles.progressCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
          <View style={styles.progressTop}>
            <View>
              <Text style={[styles.cardLabel, { color: theme.surfaceMuted }]}>Aktualne saldo</Text>
              <Text style={[styles.balance, { color: theme.surfaceText }]}>
                {merchant.currentBalance.toLocaleString("pl-PL")} pkt
              </Text>
            </View>
            <View style={[styles.tierBadge, { backgroundColor: theme.primary }]}>
              <Text style={[styles.tierBadgeText, { color: theme.onPrimary }]}>{merchant.membershipTier}</Text>
            </View>
          </View>
          <ProgressBar
            progress={merchant.progressPercentage}
            color={theme.primaryOnSurface}
            trackColor={theme.borderOn(theme.surface)}
          />
          <Text style={[styles.nextReward, { color: theme.surfaceMuted }]}>{merchant.nextReward}</Text>
        </View>

        {merchant.rewards.map((reward) => (
          <View key={reward.id} style={[styles.rewardCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
            <Image source={{ uri: reward.image }} style={styles.rewardImage} />
            <View style={styles.rewardCopy}>
              <Text style={[styles.rewardTitle, { color: theme.surfaceText }]}>{reward.title}</Text>
              <Text style={[styles.rewardDescription, { color: theme.surfaceMuted }]}>{reward.description}</Text>
              <Text style={[styles.rewardPoints, { color: theme.primaryOnSurface }]}>
                {reward.pointsRequired.toLocaleString("pl-PL")} pkt
              </Text>
            </View>
            <Pressable style={[styles.claimButton, { backgroundColor: theme.primary }]}>
              <Ionicons name="gift-outline" size={20} color={theme.onPrimary} />
            </Pressable>
          </View>
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
  progressCard: {
    borderWidth: 1,
    borderRadius: 22,
    gap: 14,
    marginBottom: 18,
    padding: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  progressTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "800",
  },
  balance: {
    fontSize: 30,
    fontWeight: "900",
    marginTop: 4,
  },
  tierBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tierBadgeText: {
    fontSize: 12,
    fontWeight: "900",
  },
  nextReward: {
    fontSize: 13,
    fontWeight: "700",
  },
  rewardCard: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    flexDirection: "row",
    marginBottom: 12,
    padding: 12,
  },
  rewardImage: {
    borderRadius: 15,
    height: 72,
    width: 72,
  },
  rewardCopy: {
    flex: 1,
    marginLeft: 14,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "900",
  },
  rewardDescription: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 17,
    marginTop: 4,
  },
  rewardPoints: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 8,
  },
  claimButton: {
    alignItems: "center",
    borderRadius: 18,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
});
