import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

import { Promotion } from "../types/merchant";

type PromotionCardProps = {
  promotion: Promotion;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  dark?: boolean;
  expanded?: boolean;
};

function PromotionCardComponent({
  promotion,
  accentColor,
  surfaceColor,
  textColor,
  mutedTextColor,
  dark = false,
  expanded = false,
}: PromotionCardProps) {
  return (
    <View
      shouldRasterizeIOS
      style={[
        styles.card,
        expanded && styles.expandedCard,
        {
          backgroundColor: surfaceColor,
          borderColor: dark ? "rgba(255,255,255,0.18)" : "rgba(18,18,18,0.06)",
        },
      ]}
    >
      <ImageBackground
        source={{ uri: promotion.image }}
        style={[styles.image, expanded && styles.expandedImage]}
        imageStyle={styles.imageRadius}
      >
        <View style={[styles.badge, { backgroundColor: accentColor }]}>
          <Text style={styles.badgeText}>{promotion.badge}</Text>
        </View>
      </ImageBackground>
      <View style={[styles.body, expanded && styles.expandedBody]}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
          {promotion.title}
        </Text>
        <Text style={[styles.subtitle, { color: mutedTextColor }]} numberOfLines={3}>
          {promotion.subtitle}
        </Text>
        <Text style={[styles.expiration, { color: accentColor }]}>{promotion.expirationDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 14,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    width: 170,
  },
  expandedCard: {
    width: 188,
  },
  image: {
    height: 112,
    padding: 12,
  },
  expandedImage: {
    height: 132,
  },
  imageRadius: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  badge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 16,
    minWidth: 44,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  body: {
    minHeight: 132,
    padding: 14,
  },
  expandedBody: {
    minHeight: 154,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 19,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 17,
    marginTop: 8,
  },
  expiration: {
    fontSize: 12,
    fontWeight: "900",
    marginTop: 12,
  },
});

export const PromotionCard = React.memo(PromotionCardComponent);
