import { View } from "react-native";
import React from "react";
import { useNavigation } from '@react-navigation/native'; // Import the navigation types
import FFSafeAreaView from "@/src/components/FFSafeAreaView";
import FFText from "@/src/components/FFText";
import FFModal from "@/src/components/FFModal";
import FFButton from "@/src/components/FFButton";
import { RootTabParamList } from "@/src/navigation/AppNavigator"; // Import the navigation types
import { StackNavigationProp } from "@react-navigation/stack";

// Define the navigation prop for the 'Stats' screen
type StatsScreenNavigationProp = StackNavigationProp<RootTabParamList, 'Stats'>;

const StatsScreen = () => {
  const navigation = useNavigation<StatsScreenNavigationProp>(); // Specify the navigation type

  return (
    <FFSafeAreaView>
      <FFModal visible onClose={() => {}} disabledClose>
        <FFText style={{ color: 'red', fontSize: 20, textAlign: 'center' }}>
          We're Almost There!
        </FFText>
        <FFText style={{ color: '#bbb', fontSize: 14, marginTop: 10 }}>
          This feature is still being built. Please return to the home screen, and we’ll notify you as soon as it’s available.
        </FFText>
        <View className="w-full">
          <FFButton
            isLinear
            className="w-full mt-6"
             onPress={() => {
              navigation.reset({
                index: 0, // Reset to the Home screen
                routes: [{ name: 'Home' }], // Ensure that 'Home' is part of RootTabParamList
              });
            }}
          >
            Home
          </FFButton>
        </View>
      </FFModal>
    </FFSafeAreaView>
  );
};

export default StatsScreen;
