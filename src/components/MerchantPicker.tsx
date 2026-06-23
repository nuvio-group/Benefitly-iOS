import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBenefitlyStore } from "../store/useBenefitlyStore";
import { MerchantConfig } from "../types/merchant";
import { MerchantLogo } from "./MerchantLogo";

type MerchantPickerProps = {
  activeMerchant: MerchantConfig;
  visible: boolean;
  onClose: () => void;
};

export function MerchantPicker({ activeMerchant, visible, onClose }: MerchantPickerProps) {
  const insets = useSafeAreaInsets();
  const merchants = useBenefitlyStore((state) => state.merchants);
  const setActiveMerchant = useBenefitlyStore((state) => state.setActiveMerchant);
  const [query, setQuery] = useState("");

  const filteredMerchants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return merchants;
    }

    return merchants.filter((merchant) => {
      const haystack = `${merchant.merchantName} ${merchant.membershipTier} ${merchant.loyaltyProgramType}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [merchants, query]);

  const selectMerchant = (merchantId: string) => {
    setActiveMerchant(merchantId);
    setQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <BlurView intensity={34} tint="dark" style={StyleSheet.absoluteFill} />
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 18) }]}>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Zmień merchanta</Text>
              <Text style={styles.subtitle}>Wybierz markę podpiętą pod Benefitly</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color="#111827" />
            </Pressable>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={19} color="#8C91A3" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Szukaj merchantów"
              placeholderTextColor="#8C91A3"
              autoCorrect={false}
              style={styles.searchInput}
              returnKeyType="search"
            />
          </View>

          <FlatList
            data={filteredMerchants}
            keyExtractor={(merchant) => merchant.id}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            alwaysBounceVertical={false}
            overScrollMode="never"
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const selected = item.id === activeMerchant.id;
              return (
                <Pressable
                  onPress={() => selectMerchant(item.id)}
                  style={[
                    styles.row,
                    selected && {
                      borderColor: item.primaryColor,
                      backgroundColor: `${item.primaryColor}10`,
                    },
                  ]}
                >
                  <MerchantLogo
                    logo={item.logo}
                    size={54}
                    backgroundColor={item.surfaceColor}
                    color={item.primaryColor}
                  />
                  <View style={styles.rowCopy}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {item.merchantName}
                    </Text>
                    <Text style={styles.rowSubtitle} numberOfLines={1}>
                      {item.membershipTier} · {item.currentBalance.toLocaleString("pl-PL")} pkt
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        borderColor: selected ? item.primaryColor : "rgba(17,24,39,0.13)",
                        backgroundColor: selected ? item.primaryColor : "#FFFFFF",
                      },
                    ]}
                  >
                    {selected ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "78%",
    paddingHorizontal: 20,
    paddingTop: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -16 },
    shadowOpacity: 0.16,
    shadowRadius: 34,
  },
  grabber: {
    alignSelf: "center",
    backgroundColor: "rgba(17,24,39,0.16)",
    borderRadius: 3,
    height: 5,
    marginBottom: 18,
    width: 46,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: "rgba(17,24,39,0.06)",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: "rgba(17,24,39,0.06)",
    borderRadius: 18,
    flexDirection: "row",
    gap: 10,
    height: 52,
    marginTop: 18,
    paddingHorizontal: 15,
  },
  searchInput: {
    color: "#111827",
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    height: 52,
  },
  list: {
    gap: 10,
    paddingTop: 16,
  },
  row: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(17,24,39,0.08)",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 13,
    minHeight: 78,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  rowCopy: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
  },
  rowSubtitle: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },
  statusDot: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
});
