import { ActivityIndicator } from "react-native";

interface LoadingProps {
  size?: number
}


export function Loading({ size = 32 }: LoadingProps) {
  return (
    <ActivityIndicator color="#7453F9" size={size} />
  );
}


