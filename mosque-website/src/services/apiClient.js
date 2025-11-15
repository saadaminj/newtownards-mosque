// services/apiClient.js

const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "";

// Generic helper for GET requests
export async function apiGet(path) {
    try{
        const url = `${API_BASE_URL}${path}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
            credentials: "same-origin"
        });

        if (!res.ok) {
            const message = `Request failed with status ${res.status}`;
            throw new Error(message);
        }

        try {
            return await res.json();
        } catch {
            throw new Error("Invalid JSON response from server");
        }
    }catch{
        throw new Error("Sorry, something went wrong. We are looking into it.")
    }
}

export async function apiPost(path, body) {
  try {
    const url = `${API_BASE_URL}${path}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(body ?? {}),
    });

    if (!res.ok) {
      const message = `Request failed with status ${res.status}`;
      throw new Error(message);
    }

    if (res.status === 204) {
      return null;
    }

    try {
      return await res.json();
    } catch {
      throw new Error("Invalid JSON response from server");
    }
  } catch (err) {
    console.error("apiPost error:", err);
    throw new Error("Sorry, something went wrong. We are looking into it.");
  }
}