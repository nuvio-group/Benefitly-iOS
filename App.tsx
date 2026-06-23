import "react-native-gesture-handler";
import "react-native-reanimated";

import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";

import { BenefitlyTabs } from "./src/navigation/BenefitlyTabs";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <BenefitlyTabs />
    </NavigationContainer>
  );
}
