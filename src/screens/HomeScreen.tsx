import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  FadeInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActivityItem } from "../components/ActivityItem";
import { MerchantCalendar } from "../components/MerchantCalendar";
import { MerchantLogo } from "../components/MerchantLogo";
import { MerchantPicker } from "../components/MerchantPicker";
import { MerchantReservationModal } from "../components/MerchantReservationModal";
import { ProgressBar } from "../components/ProgressBar";
import { PromotionCard } from "../components/PromotionCard";
import { SectionHeader } from "../components/SectionHeader";
import { isDarkTheme } from "../theme/themeEngine";
import { useActiveMerchant, useMerchantTheme } from "../store/useBenefitlyStore";

const benefitlyLogo = require("../../assets/benefitly-logo.png");

export function HomeScreen() {
  const [merchantPickerVisible, setMerchantPickerVisible] = React.useState(false);
  const [reservationVisible, setReservationVisible] = React.useState(false);
  const merchant = useActiveMerchant();
  const theme = useMerchantTheme();
  const dark = isDarkTheme(merchant);
  const hasBooking = Boolean(merchant.bookingModule?.enabled);
  const heroText = dark ? "#FFFFFF" : merchant.id === "luca-bakery" ? theme.text : "#FFFFFF";
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const heroAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(scrollY.value, [0, 210], [392, 184], Extrapolation.CLAMP),
  }));
  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(scrollY.value, [0, 210], [1.04, 1], Extrapolation.CLAMP) },
      { translateY: interpolate(scrollY.value, [0, 210], [0, -34], Extrapolation.CLAMP) },
    ],
  }));
  const pointsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 120], [1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(scrollY.value, [0, 160], [0, -28], Extrapolation.CLAMP) }],
  }));
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scrollY.value, [0, 210], [0, -10], Extrapolation.CLAMP) }],
  }));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["left", "right"]}>
      <Animated.ScrollView
        style={{ backgroundColor: theme.background }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background }]}
        bounces={false}
        alwaysBounceVertical={false}
        directionalLockEnabled
        contentInsetAdjustmentBehavior="never"
        overScrollMode="never"
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.heroOuter}>
          <Animated.View style={[styles.hero, heroAnimatedStyle]}>
            <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
              <ImageBackground source={{ uri: merchant.coverImage }} style={StyleSheet.absoluteFill} imageStyle={styles.heroImage} />
            </Animated.View>
            <LinearGradient
              colors={
                dark
                  ? ["rgba(0,0,0,0.9)", "rgba(0,0,0,0.58)", "rgba(0,0,0,0.9)"]
                  : merchant.id === "luca-bakery"
                    ? ["rgba(255,250,242,0.96)", "rgba(255,244,229,0.6)", "rgba(255,248,239,0.86)"]
                    : [`${theme.secondary}F5`, `${theme.primary}A8`, "rgba(0,0,0,0.42)"]
              }
              style={StyleSheet.absoluteFill}
            />
            <SafeAreaView edges={["top"]} style={styles.heroSafe}>
              <Animated.View style={[styles.header, headerAnimatedStyle]}>
                <Pressable style={styles.brandRow} onPress={() => setMerchantPickerVisible(true)}>
                  <View style={styles.appAvatarWrap}>
                    <Image source={benefitlyLogo} style={styles.appAvatar} />
                    <View style={[styles.merchantBadge, { borderColor: dark ? "#101010" : "#FFFFFF" }]}>
                      <MerchantLogo
                        logo={merchant.logo}
                        size={24}
                        backgroundColor={merchant.surfaceColor}
                        color={theme.primary}
                      />
                    </View>
                  </View>
                  <View style={styles.brandCopy}>
                    <Text style={[styles.brandKicker, { color: heroText }]}>Benefitly</Text>
                    <Text style={[styles.brandName, { color: heroText }]} numberOfLines={1}>
                      {merchant.merchantName}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={18} color={heroText} />
                </Pressable>
                <Pressable style={styles.bell}>
                  <Ionicons name="notifications-outline" size={25} color={heroText} />
                </Pressable>
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(420)} style={[styles.heroCopy, pointsAnimatedStyle]}>
                <Text style={[styles.greeting, { color: heroText }]}>Cześć, Radek 👋</Text>
                <Text style={[styles.label, { color: heroText }]}>Masz</Text>
                <View style={styles.pointsRow}>
                  <Text style={[styles.points, { color: heroText }]}>
                    {merchant.currentBalance.toLocaleString("pl-PL")}
                  </Text>
                  <Text style={[styles.pointsSuffix, { color: heroText }]}>pkt</Text>
                </View>
                <ProgressBar
                  progress={merchant.progressPercentage}
                  color={dark ? "#FFFFFF" : theme.primary}
                  trackColor={dark ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.44)"}
                />
                <View style={styles.progressLabels}>
                  <Text style={[styles.rewardTarget, { color: heroText }]}>{merchant.nextReward}</Text>
                  <Text style={[styles.rewardPercent, { color: heroText }]}>
                    {merchant.progressPercentage}%
                  </Text>
                </View>
              </Animated.View>
            </SafeAreaView>
          </Animated.View>

          <MerchantCalendar
            booking={merchant.bookingModule}
            accentColor={theme.primary}
            secondaryColor={theme.secondary}
            onPress={() => setReservationVisible(true)}
          />
        </View>

        <View style={[styles.content, { backgroundColor: theme.background }]}>
          <SectionHeader
            title="Aktywne promocje"
            action="Zobacz wszystkie"
            color={theme.primary}
            textColor={theme.text}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promoScroll}
            bounces={false}
            alwaysBounceHorizontal={false}
            overScrollMode="never"
          >
            {merchant.promotions.map((promotion) => (
              <PromotionCard
                key={promotion.id}
                promotion={promotion}
                accentColor={theme.primary}
                surfaceColor={theme.surface}
                textColor={theme.text}
                mutedTextColor={theme.muted}
                dark={dark}
                expanded={!hasBooking}
              />
            ))}
          </ScrollView>

          <View style={styles.activityHeader}>
            <SectionHeader title="Ostatnia aktywność" color={theme.primary} textColor={theme.text} />
          </View>
          <View
            style={[
              styles.activityCard,
              {
                backgroundColor: theme.surface,
                borderColor: dark ? "rgba(255,255,255,0.14)" : "rgba(20,20,20,0.06)",
              },
            ]}
          >
            {merchant.activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                accentColor={theme.primary}
                textColor={theme.text}
                mutedTextColor={theme.muted}
                dividerColor={dark ? "rgba(255,255,255,0.12)" : "rgba(20,20,20,0.08)"}
              />
            ))}
          </View>

        </View>
      </Animated.ScrollView>

      <MerchantPicker
        activeMerchant={merchant}
        visible={merchantPickerVisible}
        onClose={() => setMerchantPickerVisible(false)}
      />
      <MerchantReservationModal
        visible={reservationVisible}
        merchant={merchant}
        booking={merchant.bookingModule}
        accentColor={theme.primary}
        secondaryColor={theme.secondary}
        textColor={theme.text}
        mutedTextColor={theme.muted}
        surfaceColor={theme.surface}
        onClose={() => setReservationVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 126,
  },
  heroOuter: {
    marginBottom: 20,
  },
  hero: {
    height: 392,
    overflow: "hidden",
  },
  heroImage: {
    resizeMode: "cover",
  },
  heroSafe: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 18,
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 1,
    gap: 10,
    minWidth: 0,
  },
  appAvatarWrap: {
    height: 58,
    width: 58,
  },
  appAvatar: {
    borderRadius: 17,
    height: 58,
    width: 58,
  },
  merchantBadge: {
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 2,
    bottom: -3,
    height: 30,
    justifyContent: "center",
    position: "absolute",
    right: -5,
    width: 30,
  },
  brandCopy: {
    flexShrink: 1,
    minWidth: 0,
  },
  brandKicker: {
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 1,
    opacity: 0.78,
  },
  brandName: {
    flexShrink: 1,
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 0,
  },
  bell: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  heroCopy: {
    marginTop: 30,
    maxWidth: 314,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  pointsRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  points: {
    fontSize: 50,
    fontWeight: "900",
    letterSpacing: 0,
  },
  pointsSuffix: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 9,
  },
  progressLabels: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  rewardTarget: {
    flex: 1,
    fontSize: 13,
    fontWeight: "900",
  },
  rewardPercent: {
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 12,
  },
  content: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  promoScroll: {
    paddingBottom: 4,
  },
  activityHeader: {
    marginTop: 24,
  },
  activityCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
});
