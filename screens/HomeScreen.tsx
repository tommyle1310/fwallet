import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import FFSafeAreaView from "@/src/components/FFSafeAreaView";
import FFText from "@/src/components/FFText";
import FFButton from "@/src/components/FFButton";
import FFToggle from "@/src/components/FFToggle";
import FFProgressBar from "@/src/components/FFProgressbar";
import FFCircularProgressBar from "@/src/components/FFCircularProgressBar";
import FFIconWithBg from "@/src/components/FFIconWithBg";
import FFModal from "@/src/components/FFModal";
import SlideUpModal from "@/src/components/FFSlideUpModal";
import FFBottomTab from "@/src/components/FFBottomTab";
import { useSelector } from "@/src/store/types";
import { RootState } from "@/src/store/store";
import { LinearGradient } from "expo-linear-gradient";
import IconFontisto from "react-native-vector-icons/Fontisto";
import IconIonicons from "react-native-vector-icons/Ionicons";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IconFeather from "react-native-vector-icons/Feather";

import FFAvatar from "@/src/components/FFAvatar";
import {
  data_grid_Homescreen_FWalletServices,
  data_mainFeatures_Homescreen,
} from "@/src/data/screens/data_home";
import { useNavigation } from "@react-navigation/native";
import { RootTabParamList } from "@/src/navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import FFView from "@/src/components/FFView";
import { useTheme } from "@/src/hooks/useTheme";

type HomeScreenNavigationProp = StackNavigationProp<RootTabParamList, "Home">;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Specify the navigation type
  const { theme } = useTheme();
  const { email, userId, balance, fWalletId } = useSelector(
    (state: RootState) => state.auth
  ); // Get token from Redux
  return (
    <>
      <FFSafeAreaView>
        <LinearGradient
          colors={["#4FCA24", "#3C981C"]} // Switch colors when pressed
          start={[0, 0]}
          end={[0, 1]}
          className={"flex-1 p-4 gap-4"}
        >
          <View className="flex-row justify-between items-center">
            <FFAvatar />
            <TouchableOpacity className="rounded-2xl border border-orange-200 w-[50] aspect-square items-center justify-center">
              <IconFontisto name="bell-alt" color={"#fff"} size={20} />
            </TouchableOpacity>
          </View>
          <View className="items-center gap-2">
            <FFText style={{ color: "#ddd", fontSize: 14 }}>
              Available Balance
            </FFText>
            <FFText style={{ color: "#fff", fontSize: 28 }}>${balance}</FFText>
          </View>
          <FFView
            style={{
              marginBottom: -16, // Negative margin bottom
              flex: 1, // Flex 1 to fill available space

              marginTop: 48, // Margin top
              borderTopLeftRadius: 24, // 3xl rounded top-left (24 is an approximation of 3xl)
              borderTopRightRadius: 24, // 3xl rounded top-right
              marginLeft: -16, // Negative margin left
              marginRight: -16, // Negative margin right
            }}
          >
            <View
              style={{ backgroundColor: theme === "light" ? "#fff" : "#000" }}
              className=" shadow-lg shadow-violet-50 w-11/12 -mt-10 rounded-lg flex-row items-center justify-between gap-2 mx-auto  p-2"
            >
              {data_mainFeatures_Homescreen.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => item.onPress(navigation)} // Pass the navigation object to onPress
                  className="w-[20%]  items-center aspect-square"
                >
                  {item.icon}
                  <FFText style={{ fontSize: 12, color: "#2E890E" }}>
                    {item.title}
                  </FFText>
                </TouchableOpacity>
              ))}
            </View>
            <View className="mt-6 p-4 gap-4">
              <FFText>FWallet Services</FFText>
              <View className="flex-row flex-wrap w-full  justify-between gap-4 space-y-10">
                {data_grid_Homescreen_FWalletServices.map((item) => (
                  <TouchableOpacity
                    key={item.title}
                    className="items-center w-[20%]"
                  >
                    <View className="p-4 aspect-square bg-gray-50  rounded-2xl w-full items-center justify-center">
                      {item.icon}
                    </View>
                    <FFText style={{ fontWeight: 400, fontSize: 14 }}>
                      {item.title}
                    </FFText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </FFView>
        </LinearGradient>
      </FFSafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  whiteTextColor: {
    color: "#eee",
  },
});

export default HomeScreen;
