import { View } from "react-native"
import Svg, { Circle } from "react-native-svg"
import { Text } from "./Text"

interface MiniChartProps {
  total: number
  current: number
}

export function MiniChart({ current, total }: MiniChartProps) {


  const size = 44

  const strokeWidth = 6

  const color = "#7453F9"

  const backgroundColor = "#E5E5E5"
  const radius = (size - strokeWidth) / 2;

  const circumference = 2 * Math.PI * radius;

  const progress = total !== 0 ? current / total : 0;

  const offset = circumference * (1 - progress);

  return (
    <View className="items-center relative gap-1">
      <Svg
        width={size}
        height={size}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progresso */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />

      </Svg>
      <Text size="sm"> {current}/{total}</Text>
    </View>
  )
}
