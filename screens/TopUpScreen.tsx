import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook
import FFSafeAreaView from "@/src/components/FFSafeAreaView";
import FFText from "@/src/components/FFText";
import IconFeather from "react-native-vector-icons/Feather";
import { useTheme } from "@/src/hooks/useTheme";
import Deposit from "@/src/components/TopUp/Deposit";
import Withdraw from "@/src/components/TopUp/Withdraw";
import FFView from "@/src/components/FFView";

const TopUpScreen = () => {
  const [isDeposit, setIsDeposit] = useState<boolean>(true);
  const navigation = useNavigation(); // Access navigation object
  const { theme } = useTheme();
  return (
    <FFSafeAreaView>
      <View className="flex-row items-center justify-center w-full mt-4 relative">
        <TouchableOpacity
          onPress={() => navigation.goBack()} // Navigate back to the previous screen
          className="rounded-2x  w-[50] absolute left-4  aspect-square items-center justify-center"
        >
          <IconFeather
            name="chevron-left"
            color={theme === "light" ? "#111" : "#fff"}
            size={20}
          />
        </TouchableOpacity>
        <FFText style={{ fontSize: 20 }}>Top Up/Withdraw</FFText>
      </View>
      <View className=" flex-1 p-4">
        <View className="flex-row items-center w-full">
          <TouchableOpacity
            onPress={() => setIsDeposit(true)}
            className={`${
              isDeposit
                ? theme === "light"
                  ? "bg-white border-b border-gray-200"
                  : " border bg-black border-gray-200"
                : null
            } w-1/2 items-center rounded-t-xl p-4`}
          >
            <FFText
              style={{
                color: isDeposit
                  ? "#63c550"
                  : theme === "light"
                  ? "#111"
                  : "#ddd",
              }}
            >
              Deposit
            </FFText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsDeposit(false)}
            className={`${
              !isDeposit
                ? theme === "light"
                  ? "bg-white border-b border-gray-200"
                  : " border bg-black border-gray-200"
                : null
            } w-1/2 items-center rounded-t-xl p-4`}
          >
            <FFText
              style={{
                color: !isDeposit
                  ? "#63c550"
                  : theme === "light"
                  ? "#111"
                  : "#ddd",
              }}
            >
              Withdraw
            </FFText>
          </TouchableOpacity>
        </View>
        <FFView
          style={{
            padding: 10, // Custom padding
            borderBottomLeftRadius: isDeposit ? 24 : 16, // Dynamically change border radius
            borderBottomRightRadius: isDeposit ? 24 : 16, // Dynamically change border radius
            backgroundColor: theme === "light" ? "white" : "black",
          }}
        >
          {isDeposit ? <Deposit /> : <Withdraw />}
        </FFView>
      </View>
    </FFSafeAreaView>
  );
};

export default TopUpScreen;
