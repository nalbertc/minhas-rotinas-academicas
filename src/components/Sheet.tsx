// import { Text } from "react-native"

import { useColorScheme } from "nativewind"
import React, { ReactNode } from "react"
import { Dimensions, StyleSheet, TouchableWithoutFeedback, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { Heading } from "./Heading"

type Props = {
  onClose: () => void,

  title?: string,
  content?: ReactNode

}

export function Sheet({ title, content, onClose }: Props) {
  const offset = useSharedValue(0)

  const { colorScheme } = useColorScheme()

  function close() {
    offset.value = 0
    onClose()
  }

  const pan = Gesture.Pan()
    .onChange((event) => {
      const offsetDelta = event.changeY + offset.value
      const clamp = Math.max(-SHEET_OVER_DRAG, offsetDelta)

      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp)
    })
    .onFinalize(() => {
      if (offset.value < SHEET_HEIGHT / 3) {
        offset.value = withSpring(0)
      } else {
        offset.value = withTiming(SHEET_HEIGHT, {}, () => {
          runOnJS(close)()
        })
      }
    })

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }))





  return (
    <>
      <TouchableWithoutFeedback
        onPress={close}
      >

        <Animated.View

          entering={FadeIn}

          exiting={FadeOut}

          style={{
            position: 'absolute',

            top: 0,
            left: 0,
            right: 0,
            bottom: 0,

            backgroundColor:
              colorScheme === 'dark'
                ? 'rgba(0,0,0,0.55)'
                : 'rgba(0,0,0,0.35)',

            zIndex: 10,
          }}
        />

      </TouchableWithoutFeedback>

      <GestureDetector gesture={pan}>
        <Animated.View
          className="bg-white dark:bg-[#2B2B38] rounded-t-3xl absolute z-20"
          style={[styles.container, translateY]}
          entering={SlideInDown}
          exiting={SlideOutDown}
        >

          <View className="w-full items-center justify-center py-3">

            <View className="h-[4] w-20 bg-gray-600 dark:bg-white rounded-full" />
          </View>

          <View className="mb-16 px-6  gap-4">
            <Heading >{title}</Heading>




            {
              content
            }



          </View>
        </Animated.View>
      </GestureDetector>
    </>

  )
}


const DIMENSIONS = Dimensions.get("window")
export const SHEET_HEIGHT = 120
export const SHEET_OVER_DRAG = 20
const MAX_HEIGHT =
  DIMENSIONS.height
  * 0.6;

export const styles = StyleSheet.create({
  container: {
    // height: 220,
    // maxHeight: MAX_HEIGHT,
    width: DIMENSIONS.width,

    position: "absolute",
    bottom: -SHEET_OVER_DRAG * 1.3,
  },
})

