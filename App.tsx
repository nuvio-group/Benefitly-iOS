import "react-native-gesture-handler";
import "react-native-reanimated";

import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { BenefitlyTabs } from "./src/navigation/BenefitlyTabs";

const splashLogo = require("./assets/benefitly-splash-logo.png");

export default function App() {
  const [splashVisible, setSplashVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (splashVisible) {
    return (
      <View style={styles.splash}>
        <StatusBar style="light" />
        <Image source={splashLogo} style={styles.logo} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <BenefitlyTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    alignItems: "center",
    backgroundColor: "#000000",
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    resizeMode: "contain",
    height: 120,
    width: 120,
  },
});
