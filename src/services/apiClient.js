// Base URL for the PHP backend. Update this one line if your vhost path changes.
const API_BASE_URL = import.meta.env.DEV
  ? "http://axiooapp.test/semester%208/pupuk-tanaman/backend/public/api"
  : `${window.location.origin}/backend/public/api`;

export class ApiError extends Error {
  constructor(message, status, fields = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

async function request(method, path, { body, token, query } = {}) {
  const url = new URL(API_BASE_URL + path);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    });
  }

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new ApiError(
      json?.error?.message || "Something went wrong.",
      res.status,
      json?.error?.fields || {},
    );
  }
  return json; // { data, meta? }
}

export const api = {
  get: (path, opts) => request("GET", path, opts),
  post: (path, body, opts) => request("POST", path, { ...opts, body }),
  put: (path, body, opts) => request("PUT", path, { ...opts, body }),
  delete: (path, opts) => request("DELETE", path, opts),
  upload: async (path, file, { token } = {}) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(API_BASE_URL + path, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    const text = await res.text();
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) {
      throw new ApiError(
        json?.error?.message || "Upload failed.",
        res.status,
        json?.error?.fields || {},
      );
    }
    return json;
  },
};
