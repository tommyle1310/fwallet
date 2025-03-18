import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import FFSafeAreaView from "@/src/components/FFSafeAreaView";
import FFScreenTopSection from "@/src/components/FFScreenTopSection";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  RootStackParamList,
  RootTabParamList,
} from "@/src/navigation/AppNavigator";
import ContactList, {
  Contact,
} from "@/src/components/TransferMoney/ContactList";
import { TypeAmount } from "@/src/components/TransferMoney/TypeAmount";

type TransferMoneyScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TransferMoney"
>;

const TransferMoneyScreen = () => {
  const [amount, setAmount] = useState("");
  const [screenStatus, setScreenStatus] = useState<"SEARCH" | "TYPE">("SEARCH");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleNumberPress = (num: string) => {
    setAmount((prev) => prev + num);
  };

  const handleBackspace = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setScreenStatus("TYPE");
  };

  const navigation = useNavigation<TransferMoneyScreenNavigationProp>();

  return (
    <FFSafeAreaView>
      <FFScreenTopSection
        titlePosition="left"
        navigation={navigation}
        title="Transfer To"
      />
      {screenStatus === "SEARCH" ? (
        <ContactList onSelectContact={handleSelectContact} />
      ) : (
        selectedContact && (
          <TypeAmount
            handleNumberPress={handleNumberPress}
            handleBackspace={handleBackspace}
            amount={amount}
            contact={selectedContact}
          />
        )
      )}
    </FFSafeAreaView>
  );
};

export default TransferMoneyScreen;
