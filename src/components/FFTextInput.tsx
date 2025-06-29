import { View, TextInput, StyleSheet, Platform } from "react-native";
import React from "react";
import { useTheme } from "../hooks/useTheme";

const FFTextInput = ({
  isInvalid,
  value,
  handleChangeText,
  placeholder = "$0",
}: {
  isInvalid: boolean;
  value: string;
  handleChangeText: (value: string) => void;
  placeholder?: string;
}) => {
  const { theme } = useTheme();

  const inputStyles = {
    color: theme === "light" ? "#111" : "#fff",
    borderColor: isInvalid ? "#f44444" : "#D1D5DB",
  };

  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={theme === "light" ? "#9CA3AF" : "#6B7280"}
      style={[styles.input, inputStyles]}
      value={value}
      onChangeText={handleChangeText}
      keyboardType="numeric"
      underlineColorAndroid="transparent"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "android" ? 8 : 12,
    borderWidth: 1,
    width: "100%",
    backgroundColor: "transparent",
    ...Platform.select({
      android: {
        textAlignVertical: "center",
        includeFontPadding: false,
      },
      ios: {
        lineHeight: 24,
      },
    }),
  },
});

export default FFTextInput;
