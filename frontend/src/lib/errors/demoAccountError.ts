import axios from "axios";

// The backend answers 403 when a visitor tries to change credentials, reset or delete
// one of the shared demo accounts.
export const isDemoAccountError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 403;
