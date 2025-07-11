import { View, TouchableOpacity, Keyboard } from "react-native";
import React, { useState } from "react";
import FFView from "../FFView";
import FFText from "../FFText";
import FFButton from "../FFButton";
import FFAvatar from "../FFAvatar";
import ModalConfirmPayment from "./ModalConfirmPayment";
import FFTextInput from "../FFTextInput";
import { useTheme } from "@/src/hooks/useTheme";
import { useSelector } from "@/src/store/types";
import { RootState } from "@/src/store/store";
import FFInputControl from "../FFInputControl";

interface DepositProps {
  value: string;
  setValue: (value: string) => void;
  setIsShowModalConfirm: (isShow: boolean) => void;
}

const Deposit: React.FC<DepositProps> = ({
  value,
  setValue,
  setIsShowModalConfirm,
}) => {
  const { theme } = useTheme();
  const [invalidValueMessage, setInvalidValueMessage] = useState("");
  const { email, balance } = useSelector((state: RootState) => state.auth); // Get token from Redux

  const handleChangeText = (text: string) => {
    // Only allow numbers
    if (/^\d*$/.test(text)) {
      setValue(text);
    }
  };

  const handleContinue = () => {
    if (!value) {
      setInvalidValueMessage("Please enter a value to proceed payment");
      return;
    }

    setInvalidValueMessage("");
    setIsShowModalConfirm(true);
    Keyboard.dismiss();
  };

  return (
    <>
      <FFView
        style={{
          borderWidth: 0,
          padding: 8,
          backgroundColor: theme === "light" ? "white" : "black",
        }}
      >
        <FFText>Deposit to</FFText>
        <TouchableOpacity
          style={{ marginVertical: 8 }}
          className="p-4 rounded-2xl flex-row w-1/2 justify-between items-center border border-gray-300 "
        >
          <View className="items-center flex-row gap-2 justify-between">
            <FFAvatar size={40} />
            <View className=" gap-1 flex-col">
              <FFText style={{ color: "#2E890E" }}>FWallet</FFText>
              <FFText style={{ fontSize: 12 }}>${balance}</FFText>
            </View>
          </View>
        </TouchableOpacity>

        <View
          style={{ marginVertical: 10, marginBottom: 36 }}
          className="gap-1 "
        >
          <FFInputControl
            label="Enter amount:"
            placeholder="30"
            setValue={handleChangeText}
            value={value}
          />
          {invalidValueMessage && (
            <FFText style={{ color: "red", fontSize: 12 }}>
              *{invalidValueMessage}
            </FFText>
          )}
        </View>
        <FFButton onPress={handleContinue} isLinear className="w-full">
          Continue
        </FFButton>
      </FFView>
    </>
  );
};

export default Deposit;
