import React from "react";
import { Text as RNText, TextProps, useColorScheme } from "react-native";

type TextSize = "header" | "body" | "caption";

interface ThemedTextProps extends TextProps {
  size?: TextSize;
  children: React.ReactNode;
}

export function Text({
  size = "body",
  style,
  children,
  ...rest
}: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = {
    text: isDark ? "#FFFFFF" : "#000000",
  };

  const sizes = {
    header: {
      fontSize: 24,
      fontWeight: "700" as const,
      lineHeight: 32,
    },
    body: {
      fontSize: 16,
      fontWeight: "400" as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 12,
      fontWeight: "400" as const,
      lineHeight: 16,
    },
  };

  return (
    <RNText
      style={[
        {
          color: colors.text,
          ...sizes[size],
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
