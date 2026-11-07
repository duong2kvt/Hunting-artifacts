import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Ticket = {
  id: string;
  museumId: string;
  title: string;
  description: string;
  expires: string;
  status: "active" | "used" | "expired";
};

export type GameState = {
  name: string;
  avatar: number | null;
  joinedAt: string;
  onboarded: boolean;
  tutorialDone: boolean;
  collectionGuideSeen: boolean;
  /** id cổ vật đã săn + ngày săn */
  collected: Record<string, string>;
  tickets: Ticket[];
};

const INITIAL: GameState = {
  name: "",
  avatar: null,
  joinedAt: "",
  onboarded: false,
  tutorialDone: false,
  collectionGuideSeen: false,
  collected: {},
  tickets: [],
};

type Ctx = GameState & {
  ready: boolean;
  setName: (n: string) => void;
  setAvatar: (i: number) => void;
  update: (patch: Partial<GameState>) => void;
  collect: (artifactId: string) => void;
  addTicket: (t: Ticket) => void;
  reset: () => void;
};

const KEY = "das-app/state/v1";
const ProfileContext = createContext<Ctx | null>(null);

export const today = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
};

/** Trạng thái người chơi – lưu bằng AsyncStorage để mở lại app vẫn còn tiến trình */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(INITIAL);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setState({ ...INITIAL, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const update = useCallback(
    (patch: Partial<GameState>) => setState((s) => ({ ...s, ...patch })),
    [],
  );

  const collect = useCallback((id: string) => {
    setState((s) => s.collected[id] ? s : {
      ...s, collected: { ...s.collected, [id]: today() },
    });
  }, []);
  const addTicket = useCallback((ticket: Ticket) => {
    setState((s) => s.tickets.some((item) => item.id === ticket.id) ? s : {
      ...s, tickets: [...s.tickets, ticket],
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      ready,
      update,
      setName: (name) => update({ name }),
      setAvatar: (avatar) => update({ avatar }),
      collect,
      addTicket,
      reset: () => setState(INITIAL),
    }),
    [state, ready, update, collect, addTicket],
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
