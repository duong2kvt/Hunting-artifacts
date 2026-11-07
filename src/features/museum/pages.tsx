import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInLeft,
  ZoomIn,
} from "react-native-reanimated";

import {
  ARCHITECTURE,
  HISTORY,
  MUSEUMS,
  MUSEUM_ARTIFACTS,
  QUICK_INFO,
} from "@/data/content";
import { MascotDialog } from "@/features/shared/mascot-dialog";
import { ui } from "@/ui/assets";
import {
  BookPage,
  Bouncy,
  Header,
  Img,
  Pagination,
  PaperNote,
  t,
} from "@/ui/kit";
import { colors, fonts } from "@/theme/tokens";

const useMuseum = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return MUSEUMS[id ?? "btls-hcm"] ?? MUSEUMS["btls-hcm"];
};

/** "Museum details": ảnh bảo tàng + 4 mục Thông tin / Lịch sử / Cổ vật / Kiến trúc */
export function MuseumDetails() {
  const m = useMuseum();
  const go = (p: "info" | "history" | "artifacts" | "architecture") =>
    router.push({ pathname: `/museum/[id]/${p}`, params: { id: m.id } });
  const cats = [
    { a: ui.catInfo, x: 46, y: 611, p: "info" as const, label: "Thông tin" },
    {
      a: ui.catHistory,
      x: 212,
      y: 611,
      p: "history" as const,
      label: "Lịch sử",
    },
    {
      a: ui.catArtifact,
      x: 46,
      y: 699,
      p: "artifacts" as const,
      label: "Cổ vật",
    },
    {
      a: ui.catArch,
      x: 212,
      y: 699,
      p: "architecture" as const,
      label: "Kiến trúc",
    },
  ];
  return (
    <BookPage>
      <Header title="Thông tin bảo tàng" />
      <PaperNote />
      <Text
        style={[
          t.title,
          {
            position: "absolute",
            left: 69,
            top: 180,
            width: 271,
            lineHeight: 29,
          },
        ]}
      >
        {m.name}
      </Text>
      <Animated.View
        entering={ZoomIn.springify().damping(14)}
        style={{ position: "absolute", left: 41, top: 256 }}
      >
        <Img a={ui.museumPhoto} />
      </Animated.View>
      {cats.map((c, i) => (
        <Animated.View
          key={c.p}
          entering={FadeInDown.delay(120 + i * 70).springify()}
          style={{
            position: "absolute",
            left: c.x,
            top: c.y,
            width: c.a.w,
            height: c.a.h,
          }}
        >
          <Bouncy label={c.label} onPress={() => go(c.p)} style={{ flex: 1 }}>
            <Img a={c.a} />
          </Bouncy>
        </Animated.View>
      ))}
    </BookPage>
  );
}

/** "Quick Info" */
export function MuseumInfo() {
  const rows = [
    {
      icon: ui.icAddress,
      x: 44,
      y: 233,
      title: "Địa chỉ",
      value: QUICK_INFO.address,
    },
    {
      icon: ui.icFound,
      x: 210,
      y: 233,
      title: "Thành lập",
      value: QUICK_INFO.founded,
    },
    {
      icon: ui.icTicket,
      x: 44,
      y: 319,
      title: "Giá vé",
      value: QUICK_INFO.price,
    },
    {
      icon: ui.icClock,
      x: 210,
      y: 319,
      title: "Giờ mở cửa",
      value: QUICK_INFO.hours,
    },
  ];
  return (
    <BookPage>
      <Header title="Thông tin bảo tàng" />
      <PaperNote />
      <Text
        style={[
          t.title,
          {
            position: "absolute",
            left: 44,
            top: 180,
            width: 320,
            lineHeight: 29,
          },
        ]}
      >
        Thông tin nhanh
      </Text>
      {rows.map((r, i) => (
        <Animated.View
          key={r.title}
          entering={FadeIn.delay(i * 60)}
          style={{ position: "absolute", left: r.x, top: r.y, width: 154 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Img a={r.icon} style={{ position: "relative" }} />
            <Text style={t.h16}>{r.title}</Text>
          </View>
          <Text style={[t.body14, { marginLeft: 28, marginTop: 6 }]}>
            {r.value}
          </Text>
        </Animated.View>
      ))}
      <View
        style={{
          position: "absolute",
          left: 44,
          top: 385,
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Img a={ui.icMuseum} style={{ position: "relative" }} />
        <Text style={t.h16}>Lịch sự kiện & triển lãm</Text>
      </View>
      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        style={{ position: "absolute", left: 42, top: 419 }}
      >
        <Img a={ui.event1} />
      </Animated.View>
      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        style={{ position: "absolute", left: 42, top: 571 }}
      >
        <Img a={ui.event2} />
      </Animated.View>
    </BookPage>
  );
}

/** "History - Page 1…5": dòng thời gian lịch sử hình thành */
export function MuseumHistory() {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const h = HISTORY[page];
  return (
    <BookPage>
      <Header title="Thông tin bảo tàng" />
      <Animated.View
        entering={FadeIn.duration(400)}
        style={{ position: "absolute", left: 26, top: 141 }}
      >
        <Img a={ui.historyCollage} />
      </Animated.View>
      <PaperNote half x={27} y={416} />
      <Text
        style={[
          t.title,
          {
            position: "absolute",
            left: 69,
            top: 440,
            width: 271,
            lineHeight: 29,
          },
        ]}
      >
        Lịch sử hình thành
      </Text>
      <Animated.View
        key={page}
        entering={(dir > 0 ? FadeInRight : FadeInLeft).springify().damping(16)}
        style={{ position: "absolute", left: 44, top: 485, width: 320 }}
      >
        <View
          style={{
            alignSelf: "center",
            width: 66.7,
            height: 31,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img a={ui.yearBadge} />
          <Text
            style={[
              t.h16,
              { fontSize: 14, lineHeight: 20, color: colors.neutral950 },
            ]}
          >
            {h.year}
          </Text>
        </View>
        <Text
          style={[
            t.h16,
            {
              fontSize: 18,
              textAlign: "center",
              marginTop: 6,
              color: colors.neutral950,
            },
          ]}
        >
          {h.title}
        </Text>
        <Text style={[t.body16, { marginTop: 12 }]}>{h.body}</Text>
      </Animated.View>
      <Pagination
        page={page}
        total={HISTORY.length}
        onChange={(p) => {
          setDir(p > page ? 1 : -1);
          setPage(p);
        }}
      />
    </BookPage>
  );
}

/** "Artifact": danh sách cổ vật của bảo tàng + mascot hướng dẫn cách săn */
export function MuseumArtifacts() {
  const m = useMuseum();
  const [ask, setAsk] = useState<string | null>(null);
  const shortName = m.name.replace("Thành phố Hồ Chí Minh", "TP.HCM");
  return (
    <BookPage
      overlay={
        ask ? (
          <MascotDialog
            onDone={() => setAsk(null)}
            lines={[
              { text: "Muốn săn cổ vật này hả? Siêu dễ!", pose: "welcome" },
              {
                text: `Hãy đến trực tiếp ${shortName}, mở App, tìm đúng cổ vật và sử dụng tính năng “săn ngay”`,
                pose: "happy",
              },
            ]}
          />
        ) : null
      }
    >
      <Header title="Thông tin bảo tàng" />
      {MUSEUM_ARTIFACTS.map((a, i) => {
        const card = [ui.artifactCard1, ui.artifactCard2, ui.artifactCard3][i];
        const y = 152 + i * 170;
        return (
          <Animated.View
            key={a.id}
            entering={FadeInDown.delay(i * 90)
              .springify()
              .damping(14)}
            style={{
              position: "absolute",
              left: 22,
              top: y - 2,
              width: card.w,
              height: card.h,
            }}
          >
            <Img a={card} />
            <Text style={[styles.cardName, { left: 157, top: 26 }]}>
              {a.name}
            </Text>
            <Text
              style={[
                t.body14,
                {
                  position: "absolute",
                  left: 157,
                  top: 51,
                  fontFamily: "Inter_500Medium",
                },
              ]}
            >
              {a.era}
            </Text>
            <Pressable
              onPress={() => setAsk(a.id)}
              style={{
                position: "absolute",
                left: 155,
                top: 86,
                width: 190,
                height: 48,
              }}
              accessibilityRole="button"
            >
              <Text
                style={[
                  t.italic14,
                  { position: "absolute", left: 54, top: 4, width: 132 },
                ]}
              >
                Làm sao săn được cổ vật này?
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}
      <Pagination
        page={0}
        total={1}
        onChange={() => {}}
        x={27}
        y={746}
        width={354}
      />
    </BookPage>
  );
}

/** "Architect - Page 1" */
export function MuseumArchitecture() {
  const imgs = [ui.arch1, ui.arch2, ui.arch3];
  const pos = [
    { img: { x: 34, y: 232 }, text: { x: 174, y: 241, w: 192 } },
    { img: { x: 246, y: 381 }, text: { x: 42, y: 403, w: 192 } },
    { img: { x: 35, y: 536 }, text: { x: 158, y: 547, w: 208 } },
  ];
  return (
    <BookPage>
      <Header title="Thông tin bảo tàng" />
      <PaperNote />
      <Text
        style={[
          t.title,
          {
            position: "absolute",
            left: 42,
            top: 180,
            width: 324,
            lineHeight: 29,
          },
        ]}
      >
        Kiến trúc
      </Text>
      {ARCHITECTURE.map((a, i) => (
        <Animated.View
          key={a.title}
          entering={FadeInDown.delay(i * 110)
            .springify()
            .damping(14)}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Img a={imgs[i]} x={pos[i].img.x} y={pos[i].img.y} />
          <View
            style={{
              position: "absolute",
              left: pos[i].text.x,
              top: pos[i].text.y,
              width: pos[i].text.w,
            }}
          >
            <Text
              style={[
                t.h16,
                {
                  fontFamily: "Inter_700Bold",
                  fontSize: 14,
                  lineHeight: 20,
                  color: colors.neutral950,
                },
              ]}
            >
              {a.title}
            </Text>
            <Text style={[t.body14, { marginTop: 4 }]}>{a.body}</Text>
          </View>
        </Animated.View>
      ))}
      <Pagination page={0} total={1} onChange={() => {}} />
    </BookPage>
  );
}

const styles = StyleSheet.create({
  cardName: {
    position: "absolute",
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 26,
    color: colors.neutral950,
  },
});
