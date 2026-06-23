import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type SectionHeaderProps = {
  title: string;
  action?: string;
  color: string;
  textColor: string;
};

export function SectionHeader({ title, action, color, textColor }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      {action ? (
        <Pressable>
          <Text style={[styles.action, { color }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: {
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: 0,
  },
  action: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
  },
});
