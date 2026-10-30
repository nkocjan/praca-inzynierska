import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import { UserUiDTO } from "../api/generated";
import { getTokenPayload } from "./session";

export type CurrentUser = UserUiDTO & { isDemo?: boolean };

let cache: { userId: string; request: Promise<CurrentUser> } | null = null;

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
  const userId = getTokenPayload()?.userId;

  useEffect(() => {
    if (!userId) return;
    let active = true;
    loadUser(userId)
      .then(data => active && setUser(data))
      .catch(() => active && setUser(null));
    return () => {
      active = false;
    };
  }, [userId]);

  return user;
};
