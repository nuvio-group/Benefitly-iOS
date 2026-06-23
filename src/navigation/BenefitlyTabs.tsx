import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FakeQrCode } from "../components/FakeQrCode";
import { CardScreen } from "../screens/CardScreen";
import { DiscoverScreen } from "../screens/DiscoverScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { RewardsScreen } from "../screens/RewardsScreen";
import { useMerchantTheme } from "../store/useBenefitlyStore";

export type BenefitlyTabParamList = {
  Home: undefined;
  Rewards: undefined;
  Card: undefined;
  Discover: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BenefitlyTabParamList>();

export function BenefitlyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BenefitlyTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Card" component={CardScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function BenefitlyTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const theme = useMerchantTheme();
  const navAccent = readableAccent(theme.primary, theme.secondary);

  return (
    <View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View shouldRasterizeIOS style={styles.bar}>
        <View pointerEvents="none" style={styles.blurClip}>
          <BlurView intensity={48} tint="light" style={StyleSheet.absoluteFill} />
          <View style={styles.glassHighlight} />
        </View>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const isCard = route.name === "Card";
          const onPress = () => navigation.navigate(route.name);

          if (isCard) {
            return (
              <Pressable key={route.key} onPress={onPress} style={styles.centerSlot}>
                <View shouldRasterizeIOS style={[styles.centerHalo, { shadowColor: navAccent }]}>
                  <View
                    style={[
                      styles.centerButton,
                      {
                        backgroundColor: navAccent,
                        borderColor: focused ? "#FFFFFF" : "rgba(255,255,255,0.92)",
                      },
                    ]}
                  >
                    <FakeQrCode color="#FFFFFF" backgroundColor={navAccent} size={42} quietZone={5} gap={1} />
                  </View>
                </View>
              </Pressable>
            );
          }

          const iconColor = focused ? navAccent : "#8C91A3";
          const label = labels[route.name as keyof typeof labels];

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tab}>
              <TabIcon routeName={route.name as keyof BenefitlyTabParamList} color={iconColor} focused={focused} />
              <Text style={[styles.label, { color: iconColor }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function readableAccent(primary: string, fallback: string) {
  return isLightColor(primary) ? fallback : primary;
}

function isLightColor(hex: string) {
  const normalizedHex = hex.replace("#", "");
  if (normalizedHex.length !== 6) {
    return false;
  }

  const red = parseInt(normalizedHex.slice(0, 2), 16);
  const green = parseInt(normalizedHex.slice(2, 4), 16);
  const blue = parseInt(normalizedHex.slice(4, 6), 16);
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  return luminance > 0.78;
}

const labels = {
  Home: "Home",
  Rewards: "Nagrody",
  Discover: "Odkryj",
  Profile: "Profil",
};

function TabIcon({
  routeName,
  color,
  focused,
}: {
  routeName: keyof BenefitlyTabParamList;
  color: string;
  focused: boolean;
}) {
  if (routeName === "Home") {
    return <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />;
  }
  if (routeName === "Rewards") {
    return <Ionicons name={focused ? "gift" : "gift-outline"} size={24} color={color} />;
  }
  if (routeName === "Discover") {
    return <Ionicons name={focused ? "navigate-circle" : "navigate-circle-outline"} size={25} color={color} />;
  }
  return <MaterialCommunityIcons name={focused ? "account" : "account-outline"} size={25} color={color} />;
}

const styles = StyleSheet.create({
  shell: {
    bottom: 0,
    left: 0,
    paddingHorizontal: 18,
    position: "absolute",
    right: 0,
  },
  bar: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 28,
    borderColor: "rgba(255,255,255,0.82)",
    borderWidth: 1,
    flexDirection: "row",
    height: 78,
    justifyContent: "space-between",
    paddingHorizontal: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.09,
    shadowRadius: 20,
    elevation: 14,
  },
  blurClip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    overflow: "hidden",
  },
  glassHighlight: {
    backgroundColor: "rgba(255,255,255,0.54)",
    borderRadius: 20,
    height: 1,
    left: 26,
    position: "absolute",
    right: 26,
    top: 9,
  },
  tab: {
    alignItems: "center",
    flex: 1,
    gap: 5,
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
  },
  centerSlot: {
    alignItems: "center",
    flex: 1.12,
    justifyContent: "center",
  },
  centerHalo: {
    alignItems: "center",
    borderRadius: 39,
    height: 82,
    justifyContent: "center",
    marginTop: -36,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    width: 82,
  },
  centerButton: {
    alignItems: "center",
    borderRadius: 36,
    borderWidth: 4,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
});
