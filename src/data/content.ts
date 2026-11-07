/* Nội dung demo lấy từ file Figma (text layer). Khi có backend chỉ cần thay file này. */
import type { Ticket } from "@/state/profile";

export type RegionId = "south" | "central" | "north";

export const REGIONS: { id: RegionId; label: string }[] = [
  { id: "south", label: "Miền Nam" },
  { id: "central", label: "Miền Trung" },
  { id: "north", label: "Miền Bắc" },
];

export type City = {
  id: string;
  name: string;
  region: RegionId;
  /** vị trí pin trên bản đồ 400×400 (toạ độ góc trái-trên của icon 56×56) */
  pin: { x: number; y: number };
  icon?: "hcm" | "ct" | "hn";
  museums: string[];
};

export const CITIES: City[] = [
  {
    id: "tay-ninh",
    name: "Thành phố Tây Ninh",
    region: "south",
    pin: { x: 94, y: 50 },
    museums: [],
  },
  {
    id: "hcm",
    name: "Thành phố Hồ Chí Minh",
    region: "south",
    pin: { x: 186, y: 162 },
    icon: "hcm",
    museums: ["btp-hcm", "bt-vung-tau", "btls-hcm"],
  },
  {
    id: "can-tho",
    name: "Thành phố Cần Thơ",
    region: "south",
    pin: { x: 76, y: 286 },
    icon: "ct",
    museums: [],
  },
  {
    id: "ha-long",
    name: "Thành phố Hạ Long",
    region: "north",
    pin: { x: 294, y: 30 },
    museums: [],
  },
  {
    id: "ha-noi",
    name: "Thành phố Hà Nội",
    region: "north",
    pin: { x: 156, y: 117 },
    icon: "hn",
    museums: ["btls-qg", "bt-my-thuat", "bt-ha-noi"],
  },
  {
    id: "ninh-binh",
    name: "Thành phố Ninh Bình",
    region: "north",
    pin: { x: 128, y: 295 },
    museums: [],
  },
];

export type Museum = { id: string; name: string; hasDetails: boolean };

export const MUSEUMS: Record<string, Museum> = {
  "btp-hcm": {
    id: "btp-hcm",
    name: "Bảo tàng Thành phố Hồ Chí Minh",
    hasDetails: false,
  },
  "bt-vung-tau": {
    id: "bt-vung-tau",
    name: "Bảo tàng Vũng Tàu",
    hasDetails: false,
  },
  "btls-hcm": {
    id: "btls-hcm",
    name: "Bảo tàng Lịch sử Thành phố Hồ Chí Minh",
    hasDetails: true,
  },
  "btls-qg": {
    id: "btls-qg",
    name: "Bảo tàng Lịch sử Quốc gia",
    hasDetails: false,
  },
  "bt-my-thuat": {
    id: "bt-my-thuat",
    name: "Bảo tàng Mỹ thuật Việt Nam",
    hasDetails: false,
  },
  "bt-ha-noi": { id: "bt-ha-noi", name: "Bảo tàng Hà Nội", hasDetails: false },
};

export const HISTORY: { year: string; title: string; body: string }[] = [
  {
    year: "1927",
    title: "Câu chuyện khai sinh",
    body: "Dược sĩ Holbé mất năm 1927, để lại 2,160 cổ vật sau 40 năm sưu tầm. Hội Nghiên cứu Đông Dương đã quyên góp mua lại toàn bộ, tặng cho chính quyền Pháp kèm yêu cầu: “Hãy xây cho Sài Gòn một bảo tàng!”",
  },
  {
    year: "1929",
    title: "Xây dựng & Khánh thành",
    body: "Kiến trúc sư người Pháp Auguste Delaval đã thiết kế tòa nhà theo phong cách Đông Dương cách tân. Ngày 1/1/1929, Thống đốc Blanchard de la Brosse khánh thành, đặt tên bảo tàng theo chính tên ông ta.",
  },
  {
    year: "1945",
    title: "Việt Nam tiếp quản",
    body: "Sau Cách mạng tháng Tám, Bộ Quốc gia Giáo dục ra nghị định đổi tên, lần đầu tiên bảo tàng chính thức thuộc về người Việt. Năm 1945 là lần đầu tiên chúng ta đặt tay lên chìa khóa kho tàng của chính mình.",
  },
  {
    year: "1956",
    title: "Viện Bảo tàng Quốc gia",
    body: "Đổi tên thành Viện Bảo tàng Quốc gia Việt Nam tại Sài Gòn, mở rộng sưu tập mỹ thuật cổ từ nhiều nền văn hóa châu Á như Chăm Pa, Khmer, Trung Hoa.",
  },
  {
    year: "1979",
    title: "Hồi sinh sau ngày 30/4",
    body: "Sau ngày thống nhất, Chính quyền Cách mạng tiếp quản nguyên vẹn toàn bộ hiện vật. Ngày 23/8/1979 chính thức mang tên Bảo tàng Lịch sử Thành phố Hồ Chí Minh.",
  },
];

export const QUICK_INFO = {
  address: "Số 2 Nguyễn Bỉnh Khiêm, Q.1",
  founded: "Năm 1929 · Gần 100 năm lịch sử",
  price: "30.000đ / người",
  hours: "T3–CN · 8:00–17:00",
};

export const ARCHITECTURE = [
  {
    title: "Phong Cách Đông Dương Cách Tân",
    body: "Tòa nhà được kiến trúc sư người Pháp Auguste Delaval thiết kế năm 1927.",
  },
  {
    title: "Sự Giao Thoa Hoàn Hảo",
    body: "Kết hợp hài hòa giữa vẻ đẹp cổ điển châu Âu và tinh hoa kiến trúc Á Đông.",
  },
  {
    title: "Điểm Nhấn Tháp Bát Giác",
    body: "Phần trung tâm là khối tháp bát giác hùng vĩ, lấy cảm hứng từ Bát Quái Kinh Dịch.",
  },
];

export type Artifact = {
  id: string;
  no: string;
  name: string;
  era: string;
  stamp: number; // index ảnh tem 0..5
  details?: {
    period: string;
    material: string;
    size: string;
    use: string;
    facts: string[];
    quote: string;
  };
};

export const ARTIFACTS: Artifact[] = [
  {
    id: "dau-chim-phuong",
    no: "01",
    name: "Đầu chim phượng",
    era: "Thời Nhà Trần (Thế kỷ 13–14)",
    stamp: 0,
    details: {
      period: "Nhà Trần (1225–1400)",
      material: "Đất nung",
      size: "Khoảng 45–55 cm",
      use: "Trang trí mái cung điện",
      facts: [
        "Đầu chim phượng là biểu tượng của sự thịnh vượng và bình an.",
        "Từng được trang trí trên mái cung điện nhà Trần, chứng kiến thời kỳ oanh liệt nhất Đại Việt.",
      ],
      quote: "“Biểu tượng của sự thịnh vượng, cao quý và bình an”",
    },
  },
  {
    id: "dau-rong",
    no: "02",
    name: "Đầu rồng",
    era: "Thời Nhà Trần (Thế kỷ 13–14)",
    stamp: 1,
  },
  {
    id: "gach-hoa",
    no: "03",
    name: "Gạch hoa",
    era: "Thời Nhà Trần (Thế kỷ 13–14)",
    stamp: 2,
  },
  {
    id: "manh-la-de",
    no: "04",
    name: "Mảnh lá đề",
    era: "Thời Nhà Trần (Thế kỷ 13–14)",
    stamp: 3,
  },
  {
    id: "tuong-vit",
    no: "05",
    name: "Tượng vịt",
    era: "Thời Nhà Trần (Thế kỷ 13–14)",
    stamp: 4,
  },
  {
    id: "tuong-uyen-uong",
    no: "06",
    name: "Tượng uyên ương",
    era: "Thời Nhà Trần (Thế kỷ 13–14)",
    stamp: 5,
  },
];

/** Cổ vật trưng bày tại BTLS TP.HCM (màn "Cổ vật" trong thông tin bảo tàng) */
export const MUSEUM_ARTIFACTS = [
  {
    id: "dau-chim-phuong",
    name: "Đầu chim phượng",
    era: "Thời Nhà Trần (Thế kỷ 13–14)",
  },
  {
    id: "gach-hoa",
    name: "Gạch trang trí",
    era: "Thời Nhà Trần (Thế kỷ 13–14)",
  },
  { id: "tuong-vit", name: "Tượng vịt", era: "Thời Nhà Trần (Thế kỷ 13–14)" },
];

export const CULTURES = ["Thăng Long", "Sa Huỳnh", "Đông Sơn"] as const;

export const WELCOME_TICKET: Ticket = {
  id: "ticket-btls-hcm",
  museumId: "btls-hcm",
  title: "Vé thăm quan bảo tàng",
  description: "Dùng vé tại bảo tàng Lịch sử Thành phố Hồ Chí Minh",
  expires: "30/06/2026",
  status: "active",
};

export const EXTRA_TICKET: Ticket = {
  id: "ticket-chung-tich",
  museumId: "chung-tich",
  title: "Vé thăm quan bảo tàng",
  description: "Dùng vé tại bảo tàng Chứng tích Chiến tranh",
  expires: "30/06/2026",
  status: "active",
};

export const MEDALS = [
  {
    id: "explorer",
    unlocked: true,
    title: "Nhà thám hiểm",
    quote: "“Huy hiệu dành cho nhà khảo cổ ghé thăm bảo tàng đầu tiên.”",
  },
  {
    id: "first-artifact",
    unlocked: true,
    title: "Cổ vật đầu tiên",
    quote:
      "“Đây là huy hiệu đặc biệt dành cho nhà khảo cổ lần đầu tiên săn tìm được một cổ vật.”",
  },
  {
    id: "harvest",
    unlocked: true,
    title: "Mùa vàng",
    quote: "“Huy hiệu dành cho nhà khảo cổ hoàn thành hành trình hướng dẫn.”",
  },
];
