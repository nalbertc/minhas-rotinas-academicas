import clsx from "clsx";
import { Text as TextComponent, TextProps } from "react-native";

interface TextProp extends TextProps {
  size?: "xs" | "sm" | "md" | "lg",
  type?: "primary" | "secondary"
}

export function Text({ children, type = "primary", className, size = "md", ...rest }: TextProp) {
  return (
    <TextComponent className={clsx("font-regular", {
      "text-base": size === "sm",
      "text-lg": size === "md",
      "text-xl": size === "lg",
      "text-sm": size === "xs",
    }, {
      "text-black dark:text-white": type === "primary",
      "text-gray-500 dark:text-gray-400": type === "secondary",

    },

      className)}
      {...rest}

      numberOfLines={1}
      style={{
        flexShrink: 1
      }}

    >{children}</TextComponent>
  )
}