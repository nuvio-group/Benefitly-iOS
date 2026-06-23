import React from "react";
import { StyleSheet, View } from "react-native";

type ProgressBarProps = {
  progress: number;
  color: string;
  trackColor?: string;
  height?: number;
};

export function ProgressBar({
  progress,
  color,
  trackColor = "rgba(255,255,255,0.38)",
  height = 8,
}: ProgressBarProps) {
  return (
    <View style={[styles.track, { backgroundColor: trackColor, height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${Math.max(0, Math.min(progress, 100))}%`,
            backgroundColor: color,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
  },
});
