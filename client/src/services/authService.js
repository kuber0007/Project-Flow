const API_BASE_URL = "http://localhost:8000/api";

const handleResponse = async (response) => {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Something went wrong"
    );
  }

  return result;
};


// REGISTER
const registerUser = async ({ name, email, password }) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }
  );

  return handleResponse(response);
};


// LOGIN
const loginUser = async ({ email, password }) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const result = await handleResponse(response);

  if (result?.data?.accessToken) {
    localStorage.setItem(
      "accessToken",
      result.data.accessToken
    );
  }

  if (result?.data?.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(result.data.user)
    );
  }

  return result;
};


const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};


export {
  registerUser,
  loginUser,
  logoutUser,
};