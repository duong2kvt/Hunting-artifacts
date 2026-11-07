import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";

import { MEDALS } from "@/data/content";
import { useProfile, type Ticket } from "@/state/profile";
import { ui } from "@/ui/assets";
import {
  BookPage,
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

/** "Profile": thẻ tem hồ sơ + Thành tựu (huy hiệu) */
export function ProfileScreen() {
  const { name, joinedAt, collected } = useProfile();
  const [medal, setMedal] = useState<number | null>(null);
  const [toast, notify] = useToast();
  const count = Object.keys(collected).length;
  const fields = [
    { label: "Họ và tên", value: name || "—", y: 188 },
    { label: "Gia nhập", value: joinedAt || "—", y: 228 },
    { label: "Cổ vật sở hữu", value: `${count}/200`, y: 268 },
  ];
  return (
    <BookPage
      overlay={
        <>
          {medal !== null ? (
            <MedalPopup
              index={medal}
              date={Object.values(collected)[0]}
              onClose={() => setMedal(null)}
            />
          ) : null}
          {toast}
        </>
      }
    >
      <Header title="Hồ sơ" />
      <PaperNote />
      <Animated.View
        entering={ZoomIn.springify().damping(13)}
        style={{
          position: "absolute",
          left: 43,
          top: 176,
          width: 128,
          height: 164,
        }}
      >
        <Img a={ui.profileStamp} />
        <View
          style={{
            position: "absolute",
            left: 9,
            top: 8,
            width: 108,
            height: 146,
            overflow: "hidden",
          }}
        >
          <UserAvatar
            size={118}
            style={{ position: "absolute", left: -5, top: 28 }}
          />
        </View>
        <Text style={styles.no}>01</Text>
      </Animated.View>
      {fields.map((f) => (
        <View
          key={f.label}
          style={{
            position: "absolute",
            left: 187,
            top: f.y,
            width: 178,
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <Text style={[t.h16, { color: colors.chatText }]}>{f.label} : </Text>
          <View style={styles.dotted}>
            <Text style={styles.hand} numberOfLines={1} adjustsFontSizeToFit>
              {f.value}
            </Text>
          </View>
        </View>
      ))}
      <LabelButton
        a={ui.btnTicket}
        label="Vé của tôi"
        x={187}
        y={308}
        onPress={() => router.push("/profile/tickets")}
        textStyle={{ fontSize: 14, lineHeight: 20 }}
      />
      <Text
        style={[
          t.title,
          {
            position: "absolute",
            left: 43,
            top: 372,
            width: 322,
            lineHeight: 28,
          },
        ]}
      >
        Thành tựu
      </Text>
      {[ui.medalRow1, ui.medalRow2, ui.medalRow3].map((row, r) => (
        <Animated.View
          key={r}
          entering={FadeInDown.delay(150 + r * 90).springify()}
          style={{
            position: "absolute",
            left: 42,
            top: 407 + r * 96,
            width: row.w,
            height: row.h,
          }}
        >
          <Img a={row} />
          {[0, 1, 2].map((c) => (
            <Pressable
              key={c}
              accessibilityRole="button"
              accessibilityLabel={
                r === 0 ? MEDALS[c].title : "Huy hiệu chưa mở khoá"
              }
              onPress={() => {
                tapHaptic();
                if (r > 0) return notify("Huy hiệu này chưa được mở khoá");
                if (c === 1 && !Object.keys(collected).length)
                  return notify(
                    "Hãy săn cổ vật đầu tiên để nhận huy hiệu này!",
                  );
                setMedal(c);
              }}
              style={{
                position: "absolute",
                left: c * 108,
                top: 0,
                width: 108,
                height: 80,
              }}
            />
          ))}
        </Animated.View>
      ))}
      <Pagination page={0} total={1} onChange={() => {}} />
    </BookPage>
  );
}

function MedalPopup({
  index,
  date,
  onClose,
}: {
  index: number;
  date?: string;
  onClose: () => void;
}) {
  const m = MEDALS[index];
  return (
    <View style={StyleSheet.absoluteFill}>
      <Dimmer opacity={0.8} onPress={onClose} />
      <Animated.View
        entering={ZoomIn.springify().damping(13)}
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
      >
        <Img a={ui.medalNote} x={31} y={370} />
        <Img a={ui.medalInner} x={42} y={396} />
        {index === 1 ? (
          <View style={{ position: "absolute", left: 56, top: 428, width: 124, height: 96, overflow: "hidden" }}>
            <Img a={ui.medalBig} x={-132} y={0} />
          </View>
        ) : null}
        <Text
          style={[
            t.italic16,
            {
              position: "absolute",
              left: index === 1 ? 194 : 70,
              top: 440,
              width: index === 1 ? 181 : 300,
            },
          ]}
        >
          {m.quote}
        </Text>
        <Text
          style={[
            t.body14,
            {
              position: "absolute",
              left: 100,
              top: 548,
              width: 240,
              textAlign: "center",
            },
          ]}
        >
          Huy hiệu được trao vào{"\n"}
          <Text style={{ color: colors.red600, fontFamily: "Inter_500Medium" }}>
            {date ?? "hôm nay"}
          </Text>
        </Text>
        {index === 1 ? (
          <Img a={ui.medalRibbon} x={102} y={337} />
        ) : (
          <View
            style={{
              position: "absolute",
              left: 92,
              top: 337,
              width: 257,
              height: 52,
            }}
          >
            <Img a={ui.ribbonBlank} />
            <Text style={styles.ribbonText}>{m.title}</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const TABS: { key: Ticket["status"]; label: string }[] = [
  { key: "active", label: "Còn hạn" },
  { key: "used", label: "Đã dùng" },
  { key: "expired", label: "Hết hạn" },
];

/** "Vé của tôi": danh sách vé + popup mã QR */
export function TicketsScreen() {
  const { tickets } = useProfile();
  const [tab, setTab] = useState<Ticket["status"]>("active");
  const [open, setOpen] = useState<Ticket | null>(null);
  const list = tickets.filter((x) => x.status === tab);
  return (
    <BookPage
      overlay={
        open ? <Voucher ticket={open} onClose={() => setOpen(null)} /> : null
      }
    >
      <Header title="Vé của tôi" />
      <PaperNote />
      <Text
        style={[
          t.title,
          {
            position: "absolute",
            left: 43,
            top: 180,
            width: 322,
            lineHeight: 28,
          },
        ]}
      >
        Danh sách vé
      </Text>
      {TABS.map((x, i) => {
        const on = x.key === tab;
        return (
          <Pressable
            key={x.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => {
              tapHaptic();
              setTab(x.key);
            }}
            style={{
              position: "absolute",
              left: 43 + i * 86,
              top: 235,
              width: 81,
              height: 35,
            }}
          >
            <Img a={on ? ui.tabActive : ui.tabInactive} />
            <Text style={[styles.tab, on && { color: colors.neutral50 }]}>
              {x.label}
            </Text>
          </Pressable>
        );
      })}
      <View key={tab} style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {list.length === 0 ? (
          <Animated.Text
            entering={FadeIn}
            style={[
              t.body16,
              {
                position: "absolute",
                left: 43,
                top: 360,
                width: 322,
                textAlign: "center",
              },
            ]}
          >
            Chưa có vé nào ở mục này.
          </Animated.Text>
        ) : (
          list.map((x, i) => (
            <Animated.View
              key={x.id}
              entering={FadeInDown.delay(i * 90).springify()}
              style={{
                position: "absolute",
                left: 41,
                top: 289 + i * 156,
                width: 325,
                height: 145,
              }}
            >
              <Img a={x.museumId === "btls-hcm" ? ui.ticket1 : ui.ticket2} />
              <Text
                style={[
                  t.h16,
                  {
                    position: "absolute",
                    left: 14,
                    top: 9,
                    color: colors.neutral950,
                  },
                ]}
              >
                {x.title}
              </Text>
              <Text
                style={[
                  t.body14,
                  {
                    position: "absolute",
                    left: 14,
                    top: 41,
                    width: 208,
                    color: colors.chatText,
                  },
                ]}
              >
                {x.description}
              </Text>
              <Text
                style={[
                  t.body14,
                  {
                    position: "absolute",
                    left: 22,
                    top: 111,
                    color: "#3F7D20",
                  },
                ]}
              >
                EXP: {x.expires}
              </Text>
              <Pressable
                onPress={() => setOpen(x)}
                accessibilityRole="button"
                style={{
                  position: "absolute",
                  left: 206,
                  top: 100,
                  width: 114,
                  height: 40,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[
                    t.h16,
                    { color: "#3F7D20", textAlign: "right", paddingRight: 12 },
                  ]}
                >
                  Dùng ngay
                </Text>
              </Pressable>
            </Animated.View>
          ))
        )}
      </View>
      <Pagination page={0} total={1} onChange={() => {}} />
    </BookPage>
  );
}

function Voucher({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  const museum =
    ticket.museumId === "btls-hcm"
      ? "Bảo tàng Lịch sử Thành phố Hồ Chí Minh"
      : "Bảo tàng Chứng tích Chiến tranh";
  return (
    <View style={StyleSheet.absoluteFill}>
      <Dimmer opacity={0.8} onPress={onClose} />
      <Animated.View
        entering={ZoomIn.springify().damping(14)}
        style={styles.voucher}
      >
        <Text
          style={[
            t.h16,
            { fontSize: 22, lineHeight: 30, color: colors.neutral950 },
          ]}
        >
          {museum}
        </Text>
        <Text
          style={[
            t.body16,
            {
              fontSize: 18,
              lineHeight: 26,
              color: colors.neutral500,
              marginTop: 8,
            },
          ]}
        >
          Vé tham quan tại {museum.charAt(0).toLowerCase() + museum.slice(1)}
        </Text>
        <View style={{ height: 30 }} />
        <Text style={t.body16}>
          Ngày hết hạn:{" "}
          <Text style={{ color: "#2F5F7C", fontFamily: "Inter_500Medium" }}>
            {ticket.expires}
          </Text>
        </Text>
        <View style={{ marginTop: 16, width: 344, height: 344 }}>
          <Img a={ui.qrCard} />
        </View>
        <View style={{ flexDirection: "row", marginTop: 16, gap: 8 }}>
          <Img a={ui.guideAvatar} style={{ position: "relative" }} />
          <Text style={[t.italic16, { flex: 1 }]}>
            “Hãy đến trực tiếp bảo tàng và sử dụng mã QR phía trên nhé”
          </Text>
        </View>
      </Animated.View>
      <Img a={ui.voucherDivider} x={32} y={300} />
    </View>
  );
}

const styles = StyleSheet.create({
  no: {
    position: "absolute",
    left: 99,
    top: 12,
    fontFamily: fonts.display,
    fontSize: 12,
    lineHeight: 16,
    color: colors.neutral950,
  },
  dotted: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderStyle: "dotted",
    borderColor: colors.chatText,
    paddingBottom: 1,
  },
  hand: {
    fontFamily: "Inter_500Medium_Italic",
    fontSize: 17,
    lineHeight: 22,
    color: "#2F5F7C",
    textAlign: "center",
  },
  ribbonText: {
    position: "absolute",
    left: 30,
    right: 30,
    top: 12,
    textAlign: "center",
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 26,
    color: colors.neutral50,
  },
  tab: {
    position: "absolute",
    left: 0,
    right: 3,
    top: 6,
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: colors.neutral950,
  },
  voucher: {
    position: "absolute",
    left: 32,
    top: 165,
    width: 376,
    height: 626,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 16,
    shadowColor: colors.neutral800,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
});
