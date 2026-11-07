import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { CITIES, REGIONS, type City, type RegionId } from "@/data/content";
import { ui } from "@/ui/assets";
import { Bouncy, Dimmer, Header, Img, LabelButton, tapHaptic } from "@/ui/kit";
import { colors, fonts } from "@/theme/tokens";

const MAP_X = 20;
const MAP_Y = 272;

/** Popup bản đồ chọn vùng miền / thành phố (frame "Open Map" / "Select place" / "Select region") */
export function MapPopup({
  currentCity,
  onClose,
  onGo,
  notify,
}: {
  currentCity: string;
  onClose: () => void;
  onGo: (c: City) => void;
  notify: (m: string) => void;
}) {
  const cur = CITIES.find((c) => c.id === currentCity)!;
  const [region, setRegion] = useState<RegionId>(cur.region);
  const [sel, setSel] = useState<string>(cur.id);
  const city = CITIES.find((c) => c.id === sel)!;
  const cities = CITIES.filter((c) => c.region === region);
  const changed = sel !== currentCity;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Dimmer opacity={0.8} />
      <Header title="" light x={24} y={64} width={392} onBack={onClose} />

      {/* Tab vùng miền */}
      {REGIONS.map((r, i) => {
        const on = r.id === region;
        return (
          <Pressable
            key={r.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => {
              tapHaptic();
              setRegion(r.id);
              const first =
                CITIES.find((c) => c.region === r.id && c.museums.length) ??
                CITIES.find((c) => c.region === r.id);
              if (first) setSel(first.id);
            }}
            style={{
              position: "absolute",
              left: 48 + i * 116,
              top: on ? 220 : 228,
              width: 114,
              height: 58,
            }}
          >
            <Image
              source={(on ? ui.tagActive : ui.tagInactive).src}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.tag}>{r.label}</Text>
          </Pressable>
        );
      })}

      {/* Bản đồ */}
      <Animated.View
        key={region}
        entering={FadeIn.duration(260)}
        style={{
          position: "absolute",
          left: MAP_X,
          top: MAP_Y,
          width: 400,
          height: 400,
        }}
      >
        <Image
          source={(region === "north" ? ui.mapNorth : ui.mapSouth).src}
          style={StyleSheet.absoluteFill}
        />
        {region === "central" ? (
          <View style={styles.soon}>
            <Text style={styles.soonText}>Miền Trung sắp ra mắt!</Text>
          </View>
        ) : (
          cities.map((c) => (
            <Pin
              key={c.id}
              city={c}
              active={c.id === sel}
              onPress={() => setSel(c.id)}
            />
          ))
        )}
      </Animated.View>

      {/* Nhãn thành phố đang chọn */}
      {region !== "central" ? (
        <Animated.View
          key={city.id}
          entering={FadeInDown.springify().damping(14)}
          style={{
            position: "absolute",
            left: 74,
            top: 652,
            width: 293,
            height: 72,
          }}
        >
          <Img a={ui.placeTag} x={0} y={0} />
          <View style={styles.placeRow}>
            {city.icon ? (
              <Image
                source={
                  { hcm: ui.cityHcm, ct: ui.cityCt, hn: ui.cityHn }[city.icon]
                    .src
                }
                style={{ width: 56, height: 56 }}
              />
            ) : null}
            <Text style={styles.place}>{city.name}</Text>
          </View>
        </Animated.View>
      ) : null}

      <LabelButton
        a={changed ? ui.btnYellow : ui.btnWhite}
        label="Tới địa điểm"
        x={134}
        y={836}
        disabled={!changed || region === "central"}
        textStyle={{
          fontSize: 22,
          lineHeight: 30,
          color: changed ? colors.neutral950 : "#A19685",
        }}
        onPress={() =>
          city.museums.length
            ? onGo(city)
            : notify(`${city.name} đang được cập nhật bảo tàng`)
        }
      />
    </View>
  );
}

function Pin({
  city,
  active,
  onPress,
}: {
  city: City;
  active: boolean;
  onPress: () => void;
}) {
  const y = useSharedValue(0);
  const st = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Bouncy
      label={city.name}
      onPress={() => {
        y.value = withSequence(
          withTiming(-14, { duration: 140 }),
          withSpring(0, { damping: 6 }),
        );
        onPress();
      }}
      style={{
        position: "absolute",
        left: city.pin.x,
        top: city.pin.y,
        width: 56,
        height: 58,
      }}
    >
      <Animated.View style={[StyleSheet.absoluteFill, st]}>
        {active ? (
          <Animated.View
            entering={ZoomIn.springify().damping(9)}
            style={StyleSheet.absoluteFill}
          >
            <Image source={ui.pinActive.src} style={StyleSheet.absoluteFill} />
          </Animated.View>
        ) : (
          <Image
            source={ui.pinInactive.src}
            style={{ width: 56, height: 56 }}
          />
        )}
      </Animated.View>
    </Bouncy>
  );
}

const styles = StyleSheet.create({
  tag: {
    position: "absolute",
    left: 8,
    right: 8,
    top: 18,
    textAlign: "center",
    fontFamily: fonts.display,
    fontSize: 16,
    lineHeight: 22,
    color: colors.chatText,
  },
  placeRow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 4,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingRight: 8,
  },
  place: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 26,
    color: colors.chatText,
  },
  soon: {
    position: "absolute",
    left: 60,
    right: 60,
    top: 170,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(244,240,237,0.92)",
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  soonText: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 26,
    color: colors.chatText,
    textAlign: "center",
  },
});
