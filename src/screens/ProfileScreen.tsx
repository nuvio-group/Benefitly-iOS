import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MerchantLogo } from "../components/MerchantLogo";
import { useActiveMerchant, useBenefitlyStore, useMerchantTheme } from "../store/useBenefitlyStore";

const settings = [
  { icon: "notifications-outline", label: "Powiadomienia" },
  { icon: "wallet-outline", label: "Ustawienia portfela" },
  { icon: "shield-checkmark-outline", label: "Prywatność i zgody" },
] as const;

export function ProfileScreen() {
  const merchant = useActiveMerchant();
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
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>RR</Text>
          </View>
          <Text style={[styles.name, { color: theme.text }]}>Radek</Text>
          <Text style={[styles.meta, { color: theme.muted }]}>Benefitly Member</Text>
        </View>

        <View style={[styles.activeCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Aktywny merchant</Text>
          <View style={styles.activeMerchant}>
            <MerchantLogo logo={merchant.logo} size={52} backgroundColor="#FFFFFF" color={theme.primary} />
            <View style={styles.activeCopy}>
              <Text style={[styles.activeName, { color: theme.text }]}>{merchant.merchantName}</Text>
              <Text style={[styles.activeTier, { color: theme.muted }]}>{merchant.membershipTier}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.settingsCard, { backgroundColor: theme.surface }]}>
          {settings.map((item) => (
            <Pressable key={item.label} style={styles.settingRow}>
              <Ionicons name={item.icon} size={22} color={theme.primary} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.muted} />
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Zapisani merchanci</Text>
        <View style={styles.enrolledGrid}>
          {merchants.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => setActiveMerchant(item.id)}
              style={[
                styles.enrolledCard,
                { backgroundColor: item.surfaceColor },
                item.id === merchant.id && { borderColor: item.primaryColor, borderWidth: 2 },
              ]}
            >
              <MerchantLogo logo={item.logo} size={48} backgroundColor="#FFFFFF" color={item.primaryColor} />
              <Text style={[styles.enrolledName, { color: item.textColor }]} numberOfLines={2}>
                {item.merchantName}
              </Text>
            </Pressable>
          ))}
        </View>
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
    alignItems: "center",
    marginBottom: 22,
  },
  avatar: {
    alignItems: "center",
    borderRadius: 42,
    height: 84,
    justifyContent: "center",
    width: 84,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
  },
  name: {
    fontSize: 31,
    fontWeight: "900",
    marginTop: 12,
  },
  meta: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
  },
  activeCard: {
    borderRadius: 22,
    marginBottom: 14,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },
  activeMerchant: {
    alignItems: "center",
    flexDirection: "row",
  },
  activeCopy: {
    flex: 1,
    marginLeft: 14,
  },
  activeName: {
    fontSize: 17,
    fontWeight: "900",
  },
  activeTier: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },
  settingsCard: {
    borderRadius: 22,
    marginBottom: 24,
    overflow: "hidden",
  },
  settingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    minHeight: 58,
    paddingHorizontal: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
  },
  enrolledGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  enrolledCard: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: 18,
    justifyContent: "center",
    minHeight: 126,
    padding: 12,
    width: "48%",
  },
  enrolledName: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 10,
    textAlign: "center",
  },
});
