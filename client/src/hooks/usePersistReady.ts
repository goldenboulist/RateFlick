import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";

export function useAuthPersistReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(useAuthStore.persist.hasHydrated());
    const unsub = useAuthStore.persist.onFinishHydration(() => setReady(true));
    return unsub;
  }, []);
  return ready;
}
