/* eslint-disable no-unused-vars */
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
            credentials: "include"
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
    } catch (err){
        // console.error("apiPost error:", err);
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
      credentials: "include",
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
  } catch(err) {
    // console.error("apiPost error:", err);
    throw new Error("Sorry, something went wrong. We are looking into it.");
  }
}

export async function apiDelete(path, body) {
  try {
    const url = `${API_BASE_URL}${path}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      // Only send body if provided (some DELETE endpoints don't expect a body)
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      // const message = `Request failed with status ${res.status}`;
      throw new Error(res.statusText);
    }

    // Many DELETE endpoints return 204 No Content
    if (res.status === 204) {
      return null;
    }

    try {
      return await res.json();
    } catch {
      throw new Error("Invalid JSON response from server");
    }
  } catch (err) {
    // console.error("apiDelete error:", err);
    if(String(err).includes("Not Found")){
      throw new Error("This entry does not exist in Database");
    }
    throw new Error("Sorry, something went wrong. We are looking into it.");
  }
}