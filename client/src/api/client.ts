const API_URL = "http://localhost:3001";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  return fetch(API_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });
}
