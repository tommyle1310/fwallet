import { View, Image, StyleSheet } from "react-native";
import React from "react";
import FFText from "./FFText";
import { IMAGE_URL } from "../utils/constants";

const FFAvatar = ({
  size = 60,
  avatar,
}: {
  size?: number;
  avatar?: string;
}) => {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: 9999, // Makes it a circle
          overflow: "hidden", // Ensures the image is clipped to the circle
        },
      ]}
    >
      <Image
        source={{ uri: avatar || IMAGE_URL.DEFAULT_FLASHFOOD_AVATAR }} // Use default avatar if none provided
        style={{ width: "100%", height: "100%" }} // Ensure the image fills the entire container
      />
    </View>
  );
};

export default FFAvatar;
