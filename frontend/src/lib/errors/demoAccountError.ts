import axios from "axios";

// The backend answers 403 when a visitor tries to change credentials, reset or delete
// one of the shared demo accounts.
export const demoAwareErrorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error) && error.response?.status === 403
    ? "To konto demo — tej operacji nie można wykonać. Załóż własne konto, aby ją przetestować."
    : fallback;
