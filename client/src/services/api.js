const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

const apiRequest = async (
  endpoint,
  options = {}
) => {
  const token =
    localStorage.getItem(
      "accessToken"
    );

  const isFormData =
    options.body instanceof FormData;

  const headers = {
    ...(token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {}),
    ...(options.headers || {}),
  };

  if (!isFormData) {
    headers["Content-Type"] =
      "application/json";
  }

  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

  let data = null;

  const contentType =
    response.headers.get(
      "content-type"
    );

  if (
    contentType?.includes(
      "application/json"
    )
  ) {
    data =
      await response.json();
  }

  if (!response.ok) {
    if (
      response.status === 401
    ) {
      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "user"
      );
    }

    throw new Error(
      data?.message ||
        "Something went wrong with the request"
    );
  }

  return data;
};

export default apiRequest;
