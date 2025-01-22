import { View, Text } from "react-native";
import React from "react";

const FFAvatar = ({ width = 60 }: { width?: number }) => {
  return (
    <View
      style={{ width }}
      className="rounded-full aspect-square bg-orange-400"
    ></View>
  );
};

export default FFAvatar;
