import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { Activity } from "../types/merchant";

type ActivityItemProps = {
  activity: Activity;
  accentColor: string;
  textColor: string;
  mutedTextColor: string;
  dividerColor: string;
};

function ActivityItemComponent({
  activity,
  accentColor,
  textColor,
  mutedTextColor,
  dividerColor,
}: ActivityItemProps) {
  return (
    <View style={[styles.row, { borderBottomColor: dividerColor }]}>
      <Image source={{ uri: activity.image }} style={styles.avatar} />
      <View style={styles.copy}>
        <Text style={[styles.title, { color: textColor }]}>{activity.title}</Text>
        <Text style={[styles.date, { color: mutedTextColor }]}>{activity.date}</Text>
      </View>
      <Text style={[styles.points, { color: accentColor }]}>+{activity.earnedPoints} pkt</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    minHeight: 68,
    paddingHorizontal: 12,
  },
  avatar: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  copy: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
  },
  date: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  points: {
    fontSize: 14,
    fontWeight: "900",
  },
});

export const ActivityItem = React.memo(ActivityItemComponent);
