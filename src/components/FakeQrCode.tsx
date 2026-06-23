import React from "react";
import { StyleSheet, View } from "react-native";

type FakeQrCodeProps = {
  color: string;
  backgroundColor?: string;
  size?: number;
  quietZone?: number;
  gap?: number;
};

const pattern = [
  1, 1, 1, 0, 1, 0, 1, 1, 1,
  1, 0, 1, 0, 0, 1, 1, 0, 1,
  1, 1, 1, 1, 0, 1, 1, 1, 1,
  0, 1, 0, 1, 1, 0, 0, 1, 0,
  1, 0, 1, 1, 0, 1, 0, 0, 1,
  0, 1, 1, 0, 1, 1, 1, 0, 1,
  1, 1, 1, 0, 0, 1, 1, 1, 1,
  1, 0, 1, 1, 1, 0, 1, 0, 1,
  1, 1, 1, 0, 1, 1, 1, 1, 1,
];

export function FakeQrCode({
  color,
  backgroundColor = "#FFFFFF",
  size = 132,
  quietZone = Math.max(4, Math.round(size * 0.09)),
  gap = Math.max(1, Math.round(size * 0.025)),
}: FakeQrCodeProps) {
  const cell = (size - quietZone * 2 - gap * 8) / 9;
  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor,
          borderRadius: Math.round(size * 0.2),
          height: size,
          padding: quietZone,
          width: size,
        },
      ]}
    >
      {Array.from({ length: 9 }).map((_, rowIndex) => (
        <View key={rowIndex} style={[styles.row, rowIndex > 0 && { marginTop: gap }]}>
          {pattern.slice(rowIndex * 9, rowIndex * 9 + 9).map((filled, cellIndex) => (
            <View
              key={`${rowIndex}-${cellIndex}`}
              style={[
                styles.cell,
                cellIndex > 0 && { marginLeft: gap },
                {
                  backgroundColor: filled ? color : backgroundColor,
                  borderRadius: Math.max(1, Math.round(cell * 0.18)),
                  height: cell,
                  width: cell,
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    overflow: "hidden",
  },
});
