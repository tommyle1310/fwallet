import { View, Image, StyleSheet } from "react-native";
import React from "react";
import FFText from "./FFText";

const FFAvatar = ({ size = 60, avatar }: { size?: number, avatar?: string }) => {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: 9999, // Makes it a circle
          overflow: 'hidden', // Ensures the image is clipped to the circle
        },
        !avatar ? { backgroundColor: '#efcb13' } : {} // Use conditional styling
      ]}
    >
      {avatar ? (
        <Image
          source={{ uri: avatar }} // Set the avatar URL as the image source
          style={{ width: '100%', height: '100%' }} // Ensure the image fills the entire container
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* Placeholder or fallback content, such as a letter or icon */}
          <FFText style={{ color: '#fff' }}>F</FFText>
        </View>
      )}
    </View>
  );
};

export default FFAvatar;
