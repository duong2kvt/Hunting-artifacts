import { router } from "expo-router";
import { useState } from "react";

import { CITIES, MUSEUMS } from "@/data/content";
import { MapPopup } from "@/features/museum/map-popup";
import { MuseumCards } from "@/features/museum/museum-cards";
import { ui } from "@/ui/assets";
import { BookPage, Bouncy, Img, useToast } from "@/ui/kit";

/** Tab "Bảo tàng": danh sách bảo tàng theo thành phố + nút bản đồ */
export default function MuseumScreen() {
  const [city, setCity] = useState("hcm");
  const [mapOpen, setMapOpen] = useState(false);
  const [toast, notify] = useToast();
  const ids = CITIES.find((c) => c.id === city)!.museums;

  return (
    <BookPage
      overlay={
        <>
          {mapOpen ? (
            <MapPopup
              currentCity={city}
              onClose={() => setMapOpen(false)}
              notify={notify}
              onGo={(c) => {
                setCity(c.id);
                setMapOpen(false);
              }}
            />
          ) : null}
          {toast}
        </>
      }
    >
      <MuseumCards
        key={city}
        ids={ids}
        onOpen={(id) =>
          MUSEUMS[id].hasDetails
            ? router.push({ pathname: "/museum/[id]", params: { id } })
            : notify(`${MUSEUMS[id].name} sắp mở cửa trên app!`)
        }
      />
      <Bouncy
        label="Mở bản đồ"
        onPress={() => setMapOpen(true)}
        style={{
          position: "absolute",
          left: 340,
          top: 56,
          width: ui.mapButton.w,
          height: ui.mapButton.h,
        }}
      >
        <Img a={ui.mapButton} />
      </Bouncy>
    </BookPage>
  );
}
