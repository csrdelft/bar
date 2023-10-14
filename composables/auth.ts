import type { Session } from "lucia";

export const useSession = () => {
  const session = useState<Omit<Session, "activePeriodExpiresAt" | "idlePeriodExpiresAt"> | null>(
    "session",
    () => null
  );
  return session;
};

export const useAuthenticatedUser = () => {
  const session = useSession();
  return computed(() => {
    const sessionValue = unref(session);
    if (!sessionValue) {
      throw createError("useAuthenticatedUser() can only be used in protected pages");
    }
    return sessionValue.user;
  });
};
