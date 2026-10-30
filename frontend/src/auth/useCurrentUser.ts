import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import { UserUiDTO } from "../api/generated";
import { getTokenPayload } from "./session";

export type CurrentUser = UserUiDTO & { isDemo?: boolean };

let cache: { userId: string; request: Promise<CurrentUser> } | null = null;
const listeners = new Set<() => void>();

// After the user changes their login or e-mail, every mounted hook loads the profile again.
export const refreshCurrentUser = () => {
  cache = null;
  listeners.forEach(listener => listener());
};

const loadUser = (userId: string) => {
  if (cache?.userId !== userId) {
    const request = apiClient
      .get<CurrentUser>(`/api/bff/users/${userId}`)
      .then(response => response.data);
    request.catch(() => {
      cache = null;
    });
    cache = { userId, request };
  }
  return cache.request;
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [version, setVersion] = useState(0);
  const userId = getTokenPayload()?.userId;

  useEffect(() => {
    const listener = () => setVersion(value => value + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    loadUser(userId)
      .then(data => active && setUser(data))
      .catch(() => active && setUser(null));
    return () => {
      active = false;
    };
  }, [userId, version]);

  return user;
};
