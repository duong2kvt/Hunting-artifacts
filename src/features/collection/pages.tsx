import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ARTIFACTS, CULTURES, MUSEUMS } from "@/data/content";
import { MascotDialog } from "@/features/shared/mascot-dialog";
import { useProfile } from "@/state/profile";
import { ui } from "@/ui/assets";
import {
  BookPage,
  Bouncy,
  Dimmer,
  Header,
  Img,
  LabelButton,
  Pagination,
  PaperNote,
  UserAvatar,
  t,
  tapHaptic,
  useToast,
} from "@/ui/kit";
import { colors, fonts } from "@/theme/tokens";

const STAMPS = [
  ui.stamp1,
  ui.stamp2,
  ui.stamp3,
  ui.stamp4,
  ui.stamp5,
  ui.stamp6,
];
const STAMP_COLORS = [
  "#B1352A",
  "#B1352A",
  "#2F5F7C",
  "#2F5F7C",
  "#686F2E",
  "#686F2E",
];

/** Một con tem cổ vật (đã mở / bị khoá) – dùng chung cho bộ sưu tập và màn phần thưởng */
export function ArtifactStamp({
  index,
  name,
  no,
  unlocked,
}: {
  index: number;
  name: string;
  no: string;
  unlocked: boolean;
}) {
  return (
    <View style={{ width: 144, height: 184 }}>
      <Img a={unlocked ? STAMPS[index] : ui.stampLocked} />
      <Text
        style={[
          styles.stampNo,
          { color: unlocked ? STAMP_COLORS[index] : "#8E816D" },
        ]}
      >
        {unlocked ? no : "???"}
      </Text>
      <View style={styles.stampTag}>
        <Text style={styles.stampName} numberOfLines={2}>
          {name}
        </Text>
      </View>
    </View>
  );
}

/** "Collection Page": tab nền văn hoá + lưới tem 2×3 */
export function CollectionScreen() {
  const { collected, collectionGuideSeen, name, update } = useProfile();
  const [culture, setCulture] = useState(0);
  const [toast, notify] = useToast();
  const firstId = Object.keys(collected)[0];
  const showGuide = !!firstId && !collectionGuideSeen;
  const list =
    culture === 0
      ? ARTIFACTS
      : ARTIFACTS.map((a) => ({ ...a, id: `${a.id}-${culture}` }));

  return (
    <BookPage
      overlay={
        <>
          {showGuide ? (
            <MascotDialog
              onDone={() => update({ collectionGuideSeen: true })}
              lines={[
                {
                  text: `Chúc mừng ${name || "bạn"}! Cổ vật đầu tiên đã thuộc về bạn rồi!`,
                  pose: "happy",
                },
                {
                  text: "Hãy chọn vào cổ vật vừa săn được để xem thông tin chi tiết và câu chuyện của nó nhé!",
                  pose: "welcome",
                  extra: <Spotlight x={50} y={144} />,
                },
              ]}
            />
          ) : null}
          {toast}
        </>
      }
    >
      {CULTURES.map((c, i) => {
        const on = i === culture;
        return (
          <Pressable
            key={c}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => {
              tapHaptic();
              setCulture(i);
            }}
            style={{
              position: "absolute",
              left: 31 + i * 116,
              top: on ? 70 : 78,
              width: 114,
              height: 58,
            }}
          >
            <Img a={on ? ui.tagActive : ui.tagInactive} />
            <Text style={styles.tag}>{c}</Text>
          </Pressable>
        );
      })}
      <View
        key={culture}
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
      >
        {list.map((a, i) => {
          const unlocked = !!collected[a.id];
          return (
            <Animated.View
              key={a.id}
              entering={FadeInDown.delay(i * 60)
                .springify()
                .damping(14)}
              style={{
                position: "absolute",
                left: i % 2 ? 214 : 50,
                top: 144 + Math.floor(i / 2) * 196,
                width: 144,
                height: 184,
              }}
            >
              <Bouncy
                label={unlocked ? a.name : "Cổ vật chưa mở khoá"}
                onPress={() =>
                  unlocked
                    ? router.push({
                        pathname: "/collection/[id]",
                        params: { id: a.id },
                      })
                    : notify("Hãy đến bảo tàng và săn cổ vật này nhé!")
                }
                style={{ flex: 1 }}
              >
                <ArtifactStamp
                  index={a.stamp}
                  name={a.name}
                  no={a.no}
                  unlocked={unlocked}
                />
              </Bouncy>
            </Animated.View>
          );
        })}
      </View>
      <Pagination page={0} total={1} onChange={() => {}} y={755} />
    </BookPage>
  );
}

function Spotlight({ x, y }: { x: number; y: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700 }),
        withTiming(0, { duration: 700 }),
      ),
      -1,
    );
  }, [p]);
  const st = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + p.value * 0.05 }],
    opacity: 0.6 + p.value * 0.4,
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: x - 8,
          top: y - 8,
          width: 160,
          height: 200,
          borderRadius: 14,
          borderWidth: 3,
          borderColor: colors.accent500,
        },
        st,
      ]}
    />
  );
}

/** "Artifact details" + mascot "Bạn có biết?" + popup bưu thiếp "Khoe cổ vật" */
export function ArtifactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { collected } = useProfile();
  const a = ARTIFACTS.find((x) => x.id === id) ?? ARTIFACTS[0];
  const d = a.details ?? ARTIFACTS[0].details!;
  const [facts, setFacts] = useState(false);
  const [postcard, setPostcard] = useState(false);
  const info = [
    { icon: ui.icPeriod, x: 44, y: 505, title: "Thời kỳ", value: d.period },
    {
      icon: ui.icMaterial,
      x: 210,
      y: 505,
      title: "Chất liệu",
      value: d.material,
    },
    { icon: ui.icSize, x: 44, y: 597, title: "Kích thước", value: d.size },
    { icon: ui.icUse, x: 210, y: 597, title: "Công năng", value: d.use },
  ];
  return (
    <BookPage
      overlay={
        <>
          {facts ? (
            <MascotDialog
              onDone={() => setFacts(false)}
              lines={d.facts.map((f, i) => ({
                text: f,
                pose: i ? "point" : "welcome",
              }))}
            />
          ) : null}
          {postcard ? (
            <Postcard
              name={a.name}
              date={collected[a.id] ?? ""}
              onClose={() => setPostcard(false)}
            />
          ) : null}
        </>
      }
    >
      <Header title="Thông tin cổ vật" />
      <PaperNote />
      <Text
        style={[
          t.title,
          {
            position: "absolute",
            left: 69,
            top: 176,
            width: 271,
            lineHeight: 29,
          },
        ]}
      >
        {a.name}
      </Text>
      <Animated.View
        entering={ZoomIn.springify().damping(12)}
        style={{ position: "absolute", left: 72, top: 224 }}
      >
        <Img a={ui.artifactBig} />
      </Animated.View>
      <LabelButton
        a={ui.btnKhoe}
        label="Khoe cổ vật"
        x={144}
        y={437}
        onPress={() => setPostcard(true)}
        textStyle={{ fontSize: 16, lineHeight: 22 }}
      />
      {info.map((r) => (
        <View
          key={r.title}
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: 154,
            alignItems: "center",
          }}
        >
          <Img a={r.icon} style={{ position: "relative" }} />
          <Text style={[t.h16, { marginTop: 8 }]}>{r.title}</Text>
          <Text style={[t.body14, { textAlign: "center", marginTop: 4 }]}>
            {r.value}
          </Text>
        </View>
      ))}
      <Pressable
        onPress={() => setFacts(true)}
        accessibilityRole="button"
        style={{
          position: "absolute",
          left: 43,
          top: 705,
          width: 200,
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Img a={ui.guideAvatar} style={{ position: "relative" }} />
        <Text style={t.italic14}>Bạn có biết?</Text>
      </Pressable>
    </BookPage>
  );
}

function Postcard({
  name,
  date,
  onClose,
}: {
  name: string;
  date: string;
  onClose: () => void;
}) {
  const [toast, notify] = useToast();
  const museum = MUSEUMS["btls-hcm"].name;
  return (
    <View style={StyleSheet.absoluteFill}>
      <Dimmer opacity={0.8} onPress={onClose} />
      <Animated.View
        entering={ZoomIn.springify().damping(14).stiffness(150)}
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
      >
        <Img a={ui.postcardNote} x={24} y={186} />
        <Text
          style={[
            t.title,
            {
              position: "absolute",
              left: 46,
              top: 214,
              width: 349,
              fontSize: 40,
              lineHeight: 46,
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {name}
        </Text>
        <Img a={ui.postcardImage} x={46} y={266} />
        <Text style={[styles.pcMuseum, { left: 66, top: 666 }]}>{museum}</Text>
        <Text style={[styles.pcDate, { left: 66, top: 718 }]}>{date}</Text>
        <View style={{ position: "absolute", left: 298, top: 666 }}>
          <Img a={ui.postcardAvatar} />
          <UserAvatar
            size={58}
            style={{ position: "absolute", left: 9.8, top: 9.8 }}
          />
        </View>
      </Animated.View>
      <Animated.View
        entering={FadeIn.delay(250)}
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
      >
        <LabelButton
          a={ui.btnWhite}
          label="Lưu kỉ niệm"
          x={36}
          y={836}
          textStyle={styles.pcBtn}
          onPress={() => notify("Lưu ảnh bưu thiếp sẽ có ở bản cập nhật tới")}
        />
        <LabelButton
          a={ui.btnYellow}
          label="Chia sẻ"
          x={226}
          y={836}
          textStyle={styles.pcBtn}
          onPress={() =>
            Share.share({
              message: `Mình vừa săn được cổ vật “${name}” tại ${museum} trên app Truy Tìm Cổ Vật!`,
            }).catch(() => {})
          }
        />
      </Animated.View>
      {toast}
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    position: "absolute",
    left: 6,
    right: 8,
    top: 18,
    textAlign: "center",
    fontFamily: fonts.display,
    fontSize: 16,
    lineHeight: 22,
    color: colors.chatText,
  },
  stampNo: {
    position: "absolute",
    right: 13,
    top: 12,
    fontFamily: fonts.display,
    fontSize: 14,
    lineHeight: 20,
  },
  stampTag: {
    position: "absolute",
    left: 10,
    top: 133,
    width: 122,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  stampName: {
    fontFamily: fonts.display,
    fontSize: 14,
    lineHeight: 17,
    color: "#FFEDC0",
    textAlign: "center",
  },
  pcMuseum: {
    position: "absolute",
    width: 200,
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    lineHeight: 24,
    color: colors.neutral950,
  },
  pcDate: {
    position: "absolute",
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    lineHeight: 24,
    color: "#664932",
  },
  pcBtn: { fontSize: 22, lineHeight: 30 },
});
