import type { User } from "@/context/AuthContext";
import type { CompleteLessonPayload, LearningPayload } from "@/types/learning";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

interface AuthResponse {
  token: string;
  user: User;
}

interface UserResponse {
  user: User;
}

function getToken() {
  return localStorage.getItem("codeflow_token");
}

function setToken(token: string | null) {
  if (token) localStorage.setItem("codeflow_token", token);
  else localStorage.removeItem("codeflow_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body) headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message ?? "No se pudo completar la solicitud";
    throw new Error(message);
  }

  return data as T;
}

export const api = {
  getToken,
  setToken,

  async register(data: { nombre: string; correo: string; password: string; nivel: User["nivel"] }) {
    const response = await request<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setToken(response.token);
    return response.user;
  },

  async login(correo: string, password: string) {
    const response = await request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ correo, password }),
    });
    setToken(response.token);
    return response.user;
  },

  async logout() {
    if (!getToken()) return;
    await request<{ message: string }>("/logout", { method: "POST" }).catch(() => undefined);
    setToken(null);
  },

  async me() {
    const response = await request<UserResponse>("/me");
    return response.user;
  },

  async updateMe(patch: Partial<Pick<User, "nombre" | "avatar" | "nivel">>) {
    const response = await request<UserResponse>("/me", {
      method: "PUT",
      body: JSON.stringify(patch),
    });
    return response.user;
  },

  async learning() {
    return request<LearningPayload>("/learning");
  },

  async completeLesson(id: string, payload: CompleteLessonPayload) {
    const response = await request<UserResponse>(`/lessons/${id}/complete`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response.user;
  },

  async completeChallenge(id: string) {
    const response = await request<UserResponse>(`/challenges/${id}/complete`, {
      method: "POST",
    });
    return response.user;
  },
};
