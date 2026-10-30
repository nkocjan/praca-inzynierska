import axios from "axios";

// The backend answers 429 after too many wrong passwords from one address; it lets up after
// at most 15 minutes.
export const isTooManyAttemptsError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 429;
