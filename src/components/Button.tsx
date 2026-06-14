
import clsx from "clsx";

import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';


interface ButtonCompProps extends TouchableOpacityProps {
  type?: "primary" | "secondary"
}

export function Button({ children, type = "primary", ...rest }: ButtonCompProps) {
  return (
    <TouchableOpacity
      className={clsx("w-full h-14  rounded-2xl justify-center items-center", {
        "bg-primary": type === "primary",
        "bg-transparent border-2 border-primary": type === "secondary"
      })}
      {...rest}
      activeOpacity={0.8}
    >
      <Text className={clsx("font-poppins_bold text-lg", {
        "text-white": type === "primary",
        "text-black dark:text-white": type === "secondary"
      })}>{children}</Text>
    </TouchableOpacity>
  );
}