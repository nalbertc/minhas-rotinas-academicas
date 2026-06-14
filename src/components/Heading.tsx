import clsx from "clsx";
import { Text as TextComponent, TextProps } from "react-native";

interface TextProp extends TextProps {
  size?: "sm" | "md" | "lg",
}

export function Heading({ children, className, size = "md", ...rest }: TextProp) {
  return (
    <TextComponent className={clsx(" text-black dark:text-white font-semibold", {
      "text-xl": size === "sm",
      "text-2xl": size === "md",
      "text-3xl": size === "lg",
    }, className)}
      {...rest}

    >{children}</TextComponent>
  )
}