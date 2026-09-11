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

// CHANGE PASSWORD
const changePassword = async ({
  oldPassword,
  newPassword,
}) => {
  const token =
    localStorage.getItem("accessToken");

  const response = await fetch(
    `${API_BASE_URL}/auth/change-password`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    }
  );

  return handleResponse(response);
};

// FORGOT PASSWORD
const forgotPassword = async (email) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  return handleResponse(response);
};


// RESET PASSWORD
const resetPassword = async (
  token,
  newPassword
) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/reset-password/${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword,
      }),
    }
  );

  return handleResponse(response);
};

const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};


export {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  forgotPassword,
  changePassword
};