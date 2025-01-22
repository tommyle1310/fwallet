import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "../hooks/useTheme";

const FFView = ({children, className, style}: {children?: React.ReactNode, className?: string, style?: object}) => {
  const { theme } = useTheme();
  
  return (
    <View
      style={{...style,
        backgroundColor: theme === "light" ? '#eee' : "#1e1e1e", // Correctly setting the backgroundColor
        flex: 1, 
      }}
      className={className}
    >
      {children}
    </View>
  );
};

export default FFView;
