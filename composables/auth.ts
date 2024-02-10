import type { Session, User } from "lucia";

export const useUser = () => {
  const user = useState<User | null>("user", () => null);
  return user;
};

export const useSession = () => {
  const session = useState<Session | null>("session", () => null);
  return session;
};

export const useAuthenticatedUser = () => {
  const user = useUser();
  return computed(() => {
    const userValue = unref(user);
    if (!userValue) {
      throw createError("useAuthenticatedUser() can only be used in protected pages");
    }
    return userValue;
  });
};
