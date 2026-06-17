import { createContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../services/api";

type AuthContext = {
  session: null | UserAPIResponse;
  save: (data: UserAPIResponse) => void;
  remove: () => void;
  updateSession: (updatedFields: Partial<UserAPIResponse["user"]>) => void;
  isLoading: boolean;
};

export const AuthContext = createContext({} as AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<null | UserAPIResponse>(null);
  const [isLoading, setIsLoading] = useState(true);

  const LOCAL_STORAGE_KEY = "@helpdesk";

  function save(data: UserAPIResponse) {
    localStorage.setItem(
      `${LOCAL_STORAGE_KEY}:user`,
      JSON.stringify(data.user),
    );
    localStorage.setItem(`${LOCAL_STORAGE_KEY}:token`, data.token);

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    setSession(data);
  }

  function remove() {
    setSession(null);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}:user`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}:token`);

    window.location.assign("/");
  }

  function loadUser() {
    const user = localStorage.getItem(`${LOCAL_STORAGE_KEY}:user`);
    const token = localStorage.getItem(`${LOCAL_STORAGE_KEY}:token`);

    if (token && user) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setSession({
        token,
        user: JSON.parse(user),
      });
    }

    setIsLoading(false);
  }

  function updateSession(updatedFields: Partial<UserAPIResponse["user"]>) {
    setSession((prev) => {
      if (!prev?.user) return prev;

      const user = {
        ...prev.user,
        ...updatedFields,
      };

      // Se o nome, email e avatar continuam iguais, não mude o estado (evita re-render)
      if (
        user.name === prev.user.name &&
        user.email === prev.user.email &&
        user.avatar === prev.user.avatar
      ) {
        return prev;
      }

      localStorage.setItem("@helpdesk:user", JSON.stringify(user));

      return {
        ...prev,
        user,
      };
    });
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, save, isLoading, remove, updateSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}
