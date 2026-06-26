import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { accentOn, textOn } from "../theme/themeEngine";
import { BookingModule } from "../types/merchant";

type MerchantCalendarProps = {
  booking?: BookingModule;
  accentColor: string;
  secondaryColor: string;
  onPress: () => void;
};

export function MerchantCalendar({ booking, accentColor, secondaryColor, onPress }: MerchantCalendarProps) {
  if (!booking?.enabled) {
    return null;
  }

  const shellColor = "rgba(255,255,255,0.92)";
  const calendarAccent = accentOn("#FFFFFF", accentColor);
  const labelColor = accentOn("#FFFFFF", secondaryColor) === textOn("#FFFFFF")
    ? textOn("#FFFFFF")
    : accentOn("#FFFFFF", secondaryColor);

  return (
    <View style={[styles.shell, { backgroundColor: shellColor }]}>
      <Pressable
        onPress={onPress}
        style={[
          styles.button,
          {
            backgroundColor: "rgba(17,24,39,0.04)",
            borderColor: "rgba(17,24,39,0.12)",
          },
        ]}
      >
        <View style={[styles.iconBubble, { backgroundColor: "rgba(17,24,39,0.06)" }]}>
          <Ionicons name="calendar-clear-outline" size={21} color={calendarAccent} />
        </View>
        <Text style={[styles.label, { color: labelColor }]}>Rezerwacje</Text>
        <Ionicons name="chevron-forward" size={18} color={calendarAccent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderColor: "rgba(255,255,255,0.74)",
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 22,
    marginTop: 12,
    padding: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
  },
  button: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  iconBubble: {
    alignItems: "center",
    borderRadius: 13,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
  },
});
