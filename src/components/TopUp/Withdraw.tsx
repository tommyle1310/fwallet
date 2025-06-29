import { View, Text } from "react-native";
import React from "react";
import FFView from "../FFView";
import FFText from "../FFText";
import FFModal from "../FFModal";
import FFButton from "../FFButton";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  RootStackParamList,
  RootTabParamList,
} from "@/src/navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";

type WithdrawScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TopUp"
>;

const Withdraw = ({ onClose }: { onClose?: () => void }) => {
  const navigation = useNavigation<WithdrawScreenNavigationProp>();
  return (
    <FFModal visible onClose={() => {}} disabledClose>
      <FFText style={{ color: "red", fontSize: 20, textAlign: "center" }}>
        We're Almost There!
      </FFText>
      <FFText style={{ color: "#bbb", fontSize: 14, marginTop: 10 }}>
        This feature is still being built. Please return to the home screen, and
        we’ll notify you as soon as it’s available.
      </FFText>
      <View className="w-full">
        <FFButton isLinear className="w-full mt-6" onPress={onClose}>
          Back
        </FFButton>
      </View>
    </FFModal>
  );
};

export default Withdraw;
