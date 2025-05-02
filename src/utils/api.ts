const API_BASE_URL = "http://localhost:9000/v1";

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export const apiFetch = async (url: string, options: RequestOptions = {}) => {
  const token = localStorage.getItem("accessToken");
  const headers: Record<string, string> = {
    // Alteração aqui: Record<string, string>
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined), // Cast para Record ou undefined
  };

  if (token && !options.skipAuth) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(
      response.status,
      errorData.message || "Erro na requisição"
    );
  }

  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}
