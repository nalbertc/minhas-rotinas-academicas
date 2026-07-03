import { Image } from "react-native";
import logo from "../assets/logo.png";

interface LogoProps {
  height?: number;
}

5539 / 2924

export function Logo({ height = 180, }: LogoProps) {
  return (

    <Image source={logo}

      style={{

        height,

        aspectRatio:
          5539 / 2924,
      }}
      resizeMode="contain"
    />

  )
}