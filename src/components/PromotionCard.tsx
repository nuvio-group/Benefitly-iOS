import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

import { accentOn, borderOn, mutedOn, textOn } from "../theme/themeEngine";
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
  expanded = false,
}: PromotionCardProps) {
  const cardText = textOn(surfaceColor);
  const cardMuted = mutedOn(surfaceColor);
  const cardAccent = accentOn(surfaceColor, accentColor);
  const badgeText = textOn(accentColor);

  return (
    <View
      style={[
        styles.card,
        expanded && styles.expandedCard,
        {
          backgroundColor: surfaceColor,
          borderColor: borderOn(surfaceColor),
        },
      ]}
    >
      <ImageBackground
        source={{ uri: promotion.image }}
        style={[styles.image, expanded && styles.expandedImage]}
        imageStyle={styles.imageRadius}
      >
        <View style={[styles.badge, { backgroundColor: accentColor }]}>
          <Text style={[styles.badgeText, { color: badgeText }]}>{promotion.badge}</Text>
        </View>
      </ImageBackground>
      <View style={[styles.body, expanded && styles.expandedBody]}>
        <Text style={[styles.title, { color: cardText || textColor }]} numberOfLines={2}>
          {promotion.title}
        </Text>
        <Text style={[styles.subtitle, { color: cardMuted || mutedTextColor }]} numberOfLines={3}>
          {promotion.subtitle}
        </Text>
        <Text style={[styles.expiration, { color: cardAccent }]}>{promotion.expirationDate}</Text>
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
