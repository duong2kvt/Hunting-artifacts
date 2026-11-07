/**
 * Nhận diện cổ vật từ ảnh chụp.
 *
 * ⚠️ Bản demo: mô phỏng đúng kịch bản trong Figma — lần chụp đầu "chưa tối ưu góc chụp",
 * lần sau nhận diện thành công "Đầu chim phượng". Khi có model / API thật
 * (vd. gửi ảnh + vị trí GPS lên server để đối chiếu cổ vật trong bảo tàng),
 * thay phần thân hàm này và giữ nguyên kiểu trả về.
 */
export type RecognizeResult =
  | { ok: true; artifactId: string }
  | { ok: false; reason: "angle" | "location" };

export async function recognizeArtifact({
  attempt,
}: {
  uri: string | null;
  attempt: number;
}): Promise<RecognizeResult> {
  await new Promise((r) => setTimeout(r, 2600));
  if (attempt === 0) return { ok: false, reason: "angle" };
  return { ok: true, artifactId: "dau-chim-phuong" };
}
