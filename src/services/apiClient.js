// URL base de la API
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Wrapper genérico sobre fetch para comunicarse con la API
export async function apiFetch(path, options = {}) {
  const {
    method = "GET",
    body,
    token,
    headers: customHeaders,
    ...rest
  } = options;

  // Construye los headers necesarios
  const headers = {
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  // Intenta parsear el cuerpo de la respuesta, priorizando JSON
  const contentType = response.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  // Maneja errores HTTP
  if (!response.ok) {
    const error = new Error(
      (data && (data.error || data.message)) ||
        `Error ${response.status}`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export { API_BASE_URL };