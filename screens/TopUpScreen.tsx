import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook
import FFSafeAreaView from "@/src/components/FFSafeAreaView";
import FFText from "@/src/components/FFText";
import IconFeather from "react-native-vector-icons/Feather";
import { useTheme } from "@/src/hooks/useTheme";

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
        <FFText style={{fontSize: 20}}>Top Up</FFText>
      </View>
      <View className=" flex-1 p-4">
        <View className="flex-row items-center w-full">
          <TouchableOpacity onPress={() => setIsDeposit(true)} className={`${isDeposit ? 'bg-white border-b border-gray-200' : null} w-1/2 items-center rounded-t-xl p-4`}>
            <FFText style={{color: isDeposit ? '#63c550' : theme === 'light' ? '#111': '#ddd'}}>Deposit</FFText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDeposit(false)} className={`${!isDeposit ? 'bg-white border-b border-gray-200' : null} w-1/2 items-center rounded-t-xl p-4`}>
            <FFText style={{color: !isDeposit ? '#63c550' : theme === 'light' ? '#111': '#ddd'}}>Withdraw</FFText>
          </TouchableOpacity>
        </View>
        <View className={`bg-white p-4 flex-1 rounded-b-3xl ${isDeposit ? 'rounded-tr-3xl' : 'rounded-tl-3xl'}`}>
          {isDeposit ? <FFText>Deposit</FFText> : <FFText>Withdraw</FFText>}
        </View>
      </View>
    </FFSafeAreaView>
  );
};

export default TopUpScreen;
