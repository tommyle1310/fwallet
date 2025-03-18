import { TouchableOpacity, View } from "react-native";
import { Contact } from "../ContactList";
import FFAvatar from "../FFAvatar";
import { IMAGE_URL } from "@/src/utils/constants";
import FFText from "../FFText";
import FFButton from "../FFButton";
import IconIonicons from "react-native-vector-icons/Ionicons";

export interface SearchFwalletUserProps {
  handleNumberPress: (num: string) => void;
  handleBackspace: () => void;
  amount: string;
  contact: Contact;
}

export const TypeAmount: React.FC<SearchFwalletUserProps> = ({
  handleNumberPress,
  handleBackspace,
  amount,
  contact,
}) => {
  return (
    <View className="flex-1 p-4">
      <View
        style={{
          alignItems: "center",
          marginBottom: 16,
          paddingTop: 24,
        }}
      >
        <FFAvatar
          size={60}
          avatar={contact.avatar.url ?? IMAGE_URL.DEFAULT_FLASHFOOD_AVATAR}
        />
        <FFText style={{ fontSize: 18, fontWeight: "bold", marginTop: 8 }}>
          {contact.name}
        </FFText>
        <FFText style={{ fontSize: 14, color: "#888" }}>
          {contact.walletDetails}
        </FFText>
      </View>
      <FFText style={{ fontSize: 32, textAlign: "center", marginBottom: 16 }}>
        ₹{amount || "0.00"}
      </FFText>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map((num) => (
          <TouchableOpacity
            key={num}
            onPress={() => handleNumberPress(num)}
            style={{
              width: "30%",
              margin: "1.5%",
              padding: 16,
              backgroundColor: "#fcfcfc",
              alignItems: "center",
              borderRadius: 8,
            }}
          >
            <FFText style={{ fontSize: 24 }}>{num}</FFText>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={handleBackspace}
          style={{
            width: "30%",
            margin: "1.5%",
            padding: 16,
            backgroundColor: "#fcfcfc",
            alignItems: "center",
            borderRadius: 8,
          }}
        >
          <IconIonicons name="backspace" size={24} />
        </TouchableOpacity>
      </View>
      <FFButton
        className="w-full"
        style={{ marginTop: 32 }}
        onPress={() => {
          /* handle send money */
        }}
      >
        Send
      </FFButton>
    </View>
  );
};
