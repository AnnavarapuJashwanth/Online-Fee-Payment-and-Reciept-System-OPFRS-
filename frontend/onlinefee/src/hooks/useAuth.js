import { useState, useEffect } from "react";
import api from "../services/api";

export default function useAuth() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("ofprs_user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("ofprs_user", JSON.stringify(user));
    else localStorage.removeItem("ofprs_user");
  }, [user]);

  const setToken = (token) => {
    if (token) localStorage.setItem("ofprs_token", token);
    else localStorage.removeItem("ofprs_token");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return { user, setUser, setToken, logout };
}
