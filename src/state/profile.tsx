import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Profile = { name: string; avatar: number | null };

type Ctx = Profile & {
  setName: (n: string) => void;
  setAvatar: (i: number) => void;
};

const ProfileContext = createContext<Ctx | null>(null);

/** Hồ sơ người chơi (tên + avatar) – tạm lưu trong bộ nhớ, sẽ nối backend/storage ở bước sau */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<number | null>(null);
  const value = useMemo(
    () => ({ name, avatar, setName, setAvatar }),
    [name, avatar],
  );
  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
