import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

// Keep in sync with db/sql/demo-data.sql (accounts are recreated by db/reset-demo-data.sh).
export const DEMO_PASSWORD = "demo1234";

const DEMO_ACCOUNTS = [
  {
    username: "demo",
    title: "Anna — singielka w dużym mieście",
    description: "Najpełniejsza historia: wynajem, auto, podróże.",
  },
  {
    username: "student",
    title: "Jan — student",
    description: "Mały budżet, akademik, stołówka i wyjścia ze znajomymi.",
  },
  {
    username: "rodzina",
    title: "Rodzina 2+2",
    description: "Kredyt hipoteczny, przedszkole, dwa auta, wakacje.",
  },
];

interface Props {
  disabled: boolean;
  onLogin: (username: string, password: string) => void;
}

const DemoAccountsPanel = ({ disabled, onLogin }: Props) => {
  return (
    <Paper
      component="section"
      aria-labelledby="demo-heading"
      variant="outlined"
      sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Box>
          <Chip
            label="Wersja demonstracyjna"
            color="info"
            size="small"
            sx={{ mb: 1 }}
          />
          <Typography
            id="demo-heading"
            variant="h6"
            component="h2">
            Wypróbuj aplikację bez rejestracji
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary">
            Aplikacja do planowania budżetu domowego — projekt inżynierski
            (React, Spring Boot, mikroserwisy, PostgreSQL ze shardingiem i
            replikacją). Każde konto ma wydatki i budżety z ostatnich
            miesięcy.
          </Typography>
        </Box>

        <Stack
          spacing={1.5}
          divider={<Divider flexItem />}>
          {DEMO_ACCOUNTS.map(account => (
            <Stack
              key={account.username}
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2">{account.title}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary">
                  {account.description}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary">
                  Login: <strong>{account.username}</strong>
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                disabled={disabled}
                aria-label={`Zaloguj jako ${account.username}`}
                onClick={() => onLogin(account.username, DEMO_PASSWORD)}
                sx={{ flexShrink: 0 }}>
                Zaloguj
              </Button>
            </Stack>
          ))}
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary">
          Hasło do wszystkich kont: <strong>{DEMO_PASSWORD}</strong>. Dane są
          wspólne dla wszystkich odwiedzających i co 2 godziny wracają do stanu
          początkowego. Zmiana hasła i usunięcie kont demo są zablokowane — aby
          przetestować te funkcje, załóż własne konto.
        </Typography>
      </Stack>
    </Paper>
  );
};

export default DemoAccountsPanel;
