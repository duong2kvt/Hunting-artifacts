import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  FadeIn,
  ZoomIn,
  ZoomOut,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useDesignScale } from "@/components/design-canvas";
import { PaperButton } from "@/components/paper-button";
import { DESIGN, colors, type as typeStyles } from "@/theme/tokens";

import { img } from "./assets";

const POPUP_H = 294;
const CENTER_TOP = (DESIGN.height - POPUP_H) / 2;

type Props = { initial?: string; onSubmit: (name: string) => void };

/** Popup "Tên bạn là gì ?" – tự đẩy lên trên bàn phím, nút chỉ sáng khi đã nhập tên */
export function NamePopup({ initial = "", onSubmit }: Props) {
  const [name, setName] = useState(initial);
  const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const scale = useDesignScale();
  const keyboard = useAnimatedKeyboard();
  const shake = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  // Popup nằm giữa màn hình; khi bàn phím mở thì đáy popup cách mép bàn phím 30pt (như Figma: y=291)
  const lift = useAnimatedStyle(() => {
    const kb = keyboard.height.value / scale;
    const bottomLimit = DESIGN.height - kb - 30;
    const dy = Math.min(0, bottomLimit - (CENTER_TOP + POPUP_H));
    return { transform: [{ translateY: dy }, { translateX: shake.value }] };
  });

  const submit = () => {
    const v = name.trim();
    if (!v) {
      shake.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 70 }),
        withTiming(-5, { duration: 60 }),
        withTiming(0, { duration: 50 }),
      );
      return;
    }
    inputRef.current?.blur();
    onSubmit(v);
  };

  return (
    <Animated.View style={[styles.popup, lift]}>
      <Animated.View
        style={StyleSheet.absoluteFill}
        entering={ZoomIn.springify().damping(14).stiffness(170)}
        exiting={ZoomOut.duration(200)}
      >
        <Image
          source={img.popupNameOuter}
          style={styles.outer}
          contentFit="fill"
        />
        <Image
          source={img.popupNameInner}
          style={styles.inner}
          contentFit="fill"
        />

        <View style={styles.field}>
          {/*
            Font Young Display có ascent (720) thấp hơn dấu mũ tiếng Việt (~866) → ô input
            native/web cắt mất dấu (Â, Ê, Ô…). Vì vậy chữ thật hiển thị bằng <Text> đè lên,
            còn TextInput chỉ giữ caret + bàn phím (chữ trong suốt, cùng font nên caret khớp).
          */}
          <Text
            style={[
              typeStyles.input,
              styles.mirror,
              !name && { color: colors.neutral300 },
            ]}
            numberOfLines={1}
            pointerEvents="none"
          >
            {name || "Nhập tên"}
          </Text>
          <TextInput
            ref={inputRef}
            value={name}
            onChangeText={setName}
            maxLength={16}
            autoCorrect={false}
            autoCapitalize="words"
            returnKeyType="go"
            onSubmitEditing={submit}
            selectionColor={colors.neutral800}
            cursorColor={colors.neutral800}
            style={[
              typeStyles.input,
              styles.input,
              { color: "transparent" },
              Platform.OS === "web" && ({ outlineStyle: "none" } as object),
            ]}
            accessibilityLabel="Tên của bạn"
          />
        </View>

        <View style={styles.buttonWrap}>
          <PaperButton
            label="Tiếp theo"
            source={img.btnPrimary}
            width={150}
            height={56}
            imageWidth={154}
            imageHeight={60.3}
            disabled={!name.trim()}
            onPress={submit}
          />
        </View>

        <Animated.View style={styles.ribbon} entering={FadeIn.delay(150)}>
          <Image
            source={img.ribbonName}
            style={StyleSheet.absoluteFill}
            contentFit="fill"
          />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  popup: {
    position: "absolute",
    left: 31,
    top: CENTER_TOP,
    width: 377,
    height: POPUP_H,
  },
  outer: {
    position: "absolute",
    left: 0,
    top: 38.5,
    width: 379.7,
    height: 258,
  },
  inner: {
    position: "absolute",
    left: 11,
    top: 65.5,
    width: 354.7,
    height: 221,
  },
  field: {
    position: "absolute",
    left: (376 - 260) / 2,
    top: 105.5,
    width: 260,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral500,
    backgroundColor: colors.neutral50,
    justifyContent: "center",
    paddingHorizontal: 16,
    // "Card shadow 0.5": bóng cứng lệch phải-dưới
    shadowColor: colors.neutral800,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  input: { height: 48, padding: 0 },
  mirror: { position: "absolute", left: 16, right: 16, top: 7 },
  buttonWrap: { position: "absolute", left: (376 - 150) / 2, top: 197 },
  ribbon: { position: "absolute", left: 71, top: 5.6, width: 257, height: 52 },
});
