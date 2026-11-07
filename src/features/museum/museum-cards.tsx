import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ui } from "@/ui/assets";
import { Bouncy } from "@/ui/kit";

/** 3 thẻ bảo tàng dạng bưu thiếp xếp chéo trên trang sổ (component "Museum card") */
const SLOTS = [
  { x: 13, y: 69 },
  { x: 101, y: 318 },
  { x: 22, y: 559 },
];

const ART = {
  "btp-hcm": ui.museumCard1,
  "bt-vung-tau": ui.museumCard2,
  "btls-hcm": ui.museumCard3,
  "btls-qg": ui.museumHn1,
  "bt-my-thuat": ui.museumHn2,
  "bt-ha-noi": ui.museumHn3,
} as const;

export function MuseumCards({
  ids,
  onOpen,
}: {
  ids: string[];
  onOpen?: (id: string) => void;
}) {
  return (
    <>
      {ids.map((id, i) => {
        const a = ART[id as keyof typeof ART];
        const s = SLOTS[i];
        return (
          <Animated.View
            key={id}
            entering={FadeInDown.delay(80 + i * 110)
              .springify()
              .damping(13)}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: a.w,
              height: a.h,
            }}
          >
            <Bouncy label={id} onPress={() => onOpen?.(id)} style={{ flex: 1 }}>
              <Image source={a.src} style={{ width: a.w, height: a.h }} />
            </Bouncy>
          </Animated.View>
        );
      })}
    </>
  );
}
