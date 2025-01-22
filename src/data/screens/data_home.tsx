import IconFeather from "react-native-vector-icons/Feather";
import IconFontisto from "react-native-vector-icons/Fontisto";
import IconIonicons from "react-native-vector-icons/Ionicons";
import IconFontAwesome6 from "react-native-vector-icons/FontAwesome6";
import IconFontMaterialIcons from "react-native-vector-icons/MaterialIcons";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Correct typing for the array of objects
export const data_grid_Homescreen_FWalletServices: {
  title: string;
  icon: JSX.Element;
  onPress: () => void;
}[] = [
  {
    title: "Internet",
    // Ensure that IconFeather is used correctly
    icon: <IconFeather name="wifi" size={30} color="red" />, // JSX.Element as the type for the icon
    onPress: () => {},
  },
  {
    title: "Electricity",
    // Ensure that IconFeather is used correctly
    icon: (
      <IconFontMaterialIcons name="electric-bolt" size={30} color="orange" />
    ), // JSX.Element as the type for the icon
    onPress: () => {},
  },
  {
    title: "Voucher",
    // Ensure that IconFeather is used correctly
    icon: <IconFontisto name="shopping-sale" size={30} color="#5BCD33" />, // JSX.Element as the type for the icon
    onPress: () => {},
  },
  {
    title: "Assurance",
    // Ensure that IconFeather is used correctly
    icon: (
      <IconMaterialCommunityIcons
        name="briefcase-plus"
        size={30}
        color="#0DB2D4"
      />
    ), // JSX.Element as the type for the icon
    onPress: () => {},
  },
  {
    title: "Mobile Credit",
    // Ensure that IconFeather is used correctly
    icon: <IconFontAwesome6 name="mobile-retro" size={30} color="violet" />, // JSX.Element as the type for the icon
    onPress: () => {},
  },
  {
    title: "Bill",
    // Ensure that IconFeather is used correctly
    icon: <IconIonicons name="receipt-outline" size={30} color="#2041F0" />, // JSX.Element as the type for the icon
    onPress: () => {},
  },
  {
    title: "Merchant",
    // Ensure that IconFeather is used correctly
    icon: <IconIonicons name="cart" size={30} color="#E02BE7" />, // JSX.Element as the type for the icon
    onPress: () => {},
  },
  {
    title: "More",
    // Ensure that IconFeather is used correctly
    icon: (
      <IconMaterialCommunityIcons
        name="view-dashboard"
        size={30}
        color="#6C14EC"
      />
    ), // JSX.Element as the type for the icon
    onPress: () => {},
  },
];

export const data_mainFeatures_Homescreen: {
  title: string;
  icon: JSX.Element;
  onPress: (navigation: any) => void; // navigation will be passed as argument
}[] = [
  {
    title: "Top Up/Withdraw",
    icon: <IconIonicons name="wallet-outline" color="#4FCA24" size={24} />,
    onPress: (navigation) => {
      navigation.navigate('TopUp')
    },
  },
  {
    title: "Send",
    icon: <IconFeather name="gift" color="#4FCA24" size={24} />,
    onPress: (navigation) => {
      // Add the action for Send button
    },
  },
  {
    title: "Request",
    icon: (
      <IconMaterialCommunityIcons
        name="call-received"
        color="#4FCA24"
        size={24}
      />
    ),
    onPress: (navigation) => {
      // Add the action for Request button
    },
  },
  {
    title: "History",
    icon: (
      <IconMaterialCommunityIcons name="history" color="#4FCA24" size={24} />
    ),
    onPress: (navigation) => {
      // Add the action for History button
    },
  },
];
